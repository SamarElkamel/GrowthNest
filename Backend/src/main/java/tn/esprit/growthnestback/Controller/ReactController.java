package tn.esprit.growthnestback.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.DTO.ReactRequest;
import tn.esprit.growthnestback.Entities.React;
import tn.esprit.growthnestback.Services.IReactService;

import java.util.List;

@RestController
@RequestMapping("/api/reacts")
@RequiredArgsConstructor
public class ReactController {
    private final IReactService reactService;

    @PostMapping("/add")
    public React addReact(@RequestBody ReactRequest request) {
        return reactService.addReact(request);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteReact(@PathVariable("id") long idreact) {
        reactService.deleteReact(idreact);
    }

    @GetMapping("/all")
    public List<React> getAllReacts() {
        return reactService.getAllReacts();
    }

    @GetMapping("/{id}")
    public React getReactById(@PathVariable("id") long id) {
        return reactService.getReactById(id);
    }

    @GetMapping("/post/{postId}")
    public List<React> getReactsByPost(@PathVariable("postId") long postId) {
        return reactService.getReactsByPostId(postId);
    }

    @GetMapping("/user/{userId}")
    public List<React> getReactsByUser(@PathVariable("userId") long userId) {
        return reactService.getReactsByUserId(userId);
    }

}
