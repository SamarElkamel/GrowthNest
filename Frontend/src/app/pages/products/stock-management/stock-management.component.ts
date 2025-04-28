import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Products, StockMovement } from 'src/app/services/models/products';
import { GestionDesProduitsService } from 'src/app/services/services/gestion-des-produits.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.scss']
})
export class StockManagementComponent implements OnInit, OnDestroy {
  products: Products[] = [];
  filteredProducts: Products[] = [];
  stockMovements: { [key: number]: StockMovement[] } = {};
  stockRotationStats: { [key: string]: number } = {};
  quantityInputs: { [key: number]: number } = {};
  isLoading: boolean = true;
  errorMessage?: string;
  businessId: number;
  searchTerm: string = '';
  
  // Table configurations
  displayedColumns: string[] = ['product', 'stock', 'status', 'actions', 'history'];
  dataSource = new MatTableDataSource<Products>([]);
  
  // History dialog
  selectedProduct: Products | null = null;
  selectedProductMovements: StockMovement[] = [];
  historyColumns: string[] = ['date', 'type', 'quantity'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('stockHistoryDialog') stockHistoryDialog!: TemplateRef<any>;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private produitsService: GestionDesProduitsService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.businessId = +this.route.snapshot.paramMap.get('businessId')!;
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadStockRotationStats();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    
    this.subscription.add(
      this.produitsService.getProductsByBusiness({ businessId: this.businessId }).subscribe({
        next: (products) => {
          this.products = products;
          this.filteredProducts = [...products];
          this.dataSource.data = this.filteredProducts;
          this.isLoading = false;
          
          products.forEach(product => {
            this.loadStockMovements(product.idProduct);
          });
        },
        error: (err) => {
          this.errorMessage = 'Failed to load products. Please try again later.';
          this.isLoading = false;
          Swal.fire('Error', 'Could not load products', 'error');
        }
      })
    );
  }

  loadStockMovements(productId: number): void {
    this.subscription.add(
      this.produitsService.getStockMovements(productId).subscribe({
        next: (movements) => {
          this.stockMovements[productId] = movements;
        },
        error: (err) => {
          console.error(`Failed to load stock movements for product ${productId}`, err);
        }
      })
    );
  }

  loadStockRotationStats(): void {
    this.subscription.add(
      this.produitsService.getStockRotationStats(this.businessId).subscribe({
        next: (stats) => {
          this.stockRotationStats = stats;
        },
        error: (err) => {
          console.error('Failed to load stock rotation statistics', err);
        }
      })
    );
  }

  filterProducts(): void {
    if (!this.searchTerm) {
      this.filteredProducts = [...this.products];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(product => 
        product.name?.toLowerCase().includes(term) ||
        product.idProduct.toString().includes(term)
      );
    }
    this.dataSource.data = this.filteredProducts;
  }

  updateStock(product: Products, action: 'add' | 'reduce'): void {
    const quantity = this.quantityInputs[product.idProduct];
    
    if (!product.idProduct || !quantity || quantity <= 0) {
      Swal.fire('Error', 'Please enter a valid quantity', 'error');
      return;
    }

    const confirmationMessage = action === 'add' 
      ? `Add ${quantity} units to ${product.name}?` 
      : `Remove ${quantity} units from ${product.name}?`;

    Swal.fire({
      title: 'Confirm Stock Adjustment',
      text: confirmationMessage,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.performStockUpdate(product, action, quantity);
      }
    });
  }

  private performStockUpdate(product: Products, action: 'add' | 'reduce', quantity: number): void {
    const serviceCall = action === 'add'
      ? this.produitsService.addStock(product.idProduct, quantity)
      : this.produitsService.reduceStock(product.idProduct, quantity);

    this.subscription.add(
      serviceCall.subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p.idProduct === product.idProduct);
          if (index !== -1) {
            this.products[index] = updatedProduct;
            this.filterProducts();
          }
          
          this.loadStockMovements(product.idProduct);
          
          Swal.fire(
            'Success!',
            `Stock ${action === 'add' ? 'increased' : 'decreased'} by ${quantity} units`,
            'success'
          );
          
          delete this.quantityInputs[product.idProduct];
        },
        error: (err) => {
          Swal.fire('Error', 'Failed to update stock', 'error');
        }
      })
    );
  }

  getStockStatus(product: Products): { label: string, color: string } {
    const threshold = product.business?.lowStockThreshold || 5;
    if (product.stock === 0) {
      return { label: 'Out of Stock', color: 'warn' };
    } else if (product.stock <= threshold) {
      return { label: 'Low Stock', color: 'accent' };
    } else {
      return { label: 'In Stock', color: 'primary' };
    }
  }

  getStockPercentage(product: Products): number {
    // Use a fixed max value since maxStockThreshold doesn't exist in Business model
    const maxStock = 100; // Default value
    return Math.min((product.stock / maxStock) * 100, 100);
  }

  showStockHistory(product: Products): void {
    this.selectedProduct = product;
    this.selectedProductMovements = this.stockMovements[product.idProduct] || [];
    
    this.dialog.open(this.stockHistoryDialog, {
      width: '800px',
      maxHeight: '80vh'
    });
  }

  exportStockMovements(productId: number): void {
    const movements = this.stockMovements[productId] || [];
    const product = this.products.find(p => p.idProduct === productId);
    
    if (movements.length === 0) {
      Swal.fire('Info', 'No stock movements to export for this product', 'info');
      return;
    }

    // Removed currentStock from CSV as it doesn't exist in StockMovement
    const csvContent = [
      'Date,Type,Quantity',
      ...movements.map(m => `${new Date(m.timestamp).toLocaleString()},${m.movementType},${m.quantity}`)
    ].join('\n');
    
    this.downloadCSV(csvContent, `${product?.name || 'product'}_stock_history.csv`);
  }

  exportStockMovementsFromDialog(): void {
    if (this.selectedProduct) {
      this.exportStockMovements(this.selectedProduct.idProduct);
    }
  }

  exportAllStockMovements(): void {
    if (this.products.length === 0) {
      Swal.fire('Info', 'No products available to export', 'info');
      return;
    }

    // Removed currentStock from CSV as it doesn't exist in StockMovement
    let csvContent = 'Product ID,Product Name,Date,Type,Quantity\n';
    
    this.products.forEach(product => {
      const movements = this.stockMovements[product.idProduct] || [];
      movements.forEach(movement => {
        csvContent += `${product.idProduct},"${product.name}",${new Date(movement.timestamp).toLocaleString()},${movement.movementType},${movement.quantity}\n`;
      });
    });

    this.downloadCSV(csvContent, `all_stock_movements_${new Date().toISOString().split('T')[0]}.csv`);
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}