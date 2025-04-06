package tn.esprit.growthnestback.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Event;
import tn.esprit.growthnestback.Services.IEventServices;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/Event")
@Tag(name = "Event Management")
public class EventRestController {
    @Autowired
    IEventServices iEventServices;
    @Operation(description = "Display All Events")
    @GetMapping("/DisplayAllEvents")
    public List<Event> Display(){
        return iEventServices.DisplayAllEvents();
    }
    @Operation(description = "Display Event By ID ")
    @GetMapping("/DisplayEvent/{idE}")
    public Event DisplayEvent(@PathVariable("idE") Long idE){
        return iEventServices.DisplayEvents(idE);
    }
    @Operation(description = "AddEvent")
    @PostMapping("/addEvent")
    public Event addEvent(@RequestBody Event event){
        return iEventServices.addEvent(event);
    }
    @Operation(description = "UpdateEvent")
    @PutMapping("/updateEvent")
    public Event updateEvent(@RequestBody Event event){
        return iEventServices.updateEvent(event);
    }
}
