package tn.esprit.growthnestback.Services;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.DeliveryAgency;
import tn.esprit.growthnestback.Repository.DeliveryAgencyRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class DeliveryAgencyServiceImpl implements IDeliveryAgencyService {

    @Autowired
    DeliveryAgencyRepository deliveryAgencyRepository;

    @Override
    public List<DeliveryAgency> retrieveAllDeliveryAgencies() {
        return deliveryAgencyRepository.findAll();
    }

    @Override
    public DeliveryAgency retrieveDeliveryAgency(Long idAgency) {
        return deliveryAgencyRepository.findById(idAgency)
                .get();
    }

    @Override
    public DeliveryAgency addDeliveryAgency(DeliveryAgency deliveryAgency) {
        return deliveryAgencyRepository.save(deliveryAgency);
    }

    @Override
    public DeliveryAgency updateDeliveryAgency(DeliveryAgency deliveryAgency) {
        return deliveryAgencyRepository.save(deliveryAgency);
    }

    @Override
    public void deleteDeliveryAgency(Long idAgency) {
        deliveryAgencyRepository.deleteById(idAgency);
    }
}
