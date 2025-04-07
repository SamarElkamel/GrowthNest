package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.DeliveryAgency;

import java.util.List;

public interface IDeliveryAgencyService {

    List<DeliveryAgency> retrieveAllDeliveryAgencies();

    DeliveryAgency retrieveDeliveryAgency(Long idAgency);

    DeliveryAgency addDeliveryAgency(DeliveryAgency deliveryAgency);

    DeliveryAgency updateDeliveryAgency(DeliveryAgency deliveryAgency);

    void deleteDeliveryAgency(Long idAgency);
}
