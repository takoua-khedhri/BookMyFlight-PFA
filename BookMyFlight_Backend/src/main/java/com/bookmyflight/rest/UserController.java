package com.bookmyflight.rest;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.bookmyflight.bean.Login;
import com.bookmyflight.entity.User;
import com.bookmyflight.exception.UserException;
import com.bookmyflight.service.UserService;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
public class UserController {
    
    @Autowired
    private UserService userservice;
    
    // Inscription - Version corrigée
    @PostMapping(value = "/createuser", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Validation des champs
            if(user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le nom d'utilisateur est requis");
            }
            if(user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le mot de passe est requis");
            }
            if(user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("L'email est requis");
            }
            if(user.getPhone() == null || user.getPhone().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le numéro de téléphone est requis");
            }
            
            int uid = userservice.createUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Utilisateur créé avec succès");
            response.put("userId", uid);
            response.put("success", true);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UserException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            response.put("success", false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Erreur lors de la création de l'utilisateur: " + e.getMessage());
            response.put("success", false);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Authentification - Version corrigée
    @GetMapping(value="/auth/{username}/{password}", produces="application/json")
    public ResponseEntity<?> authenticate(@PathVariable String username, @PathVariable String password) {
        try {
            Login login = new Login();
            login.setUsername(username);
            login.setPassword(password);
            
            User user = userservice.validate(login);
            
            if(user != null) {
                // Ne pas envoyer le mot de passe dans la réponse
                user.setPassword(null);
                
                Map<String, Object> response = new HashMap<>();
                response.put("userId", user.getUserId());
                response.put("username", user.getUsername());
                response.put("fname", user.getFname());
                response.put("email", user.getEmail());
                response.put("phone", user.getPhone());
                response.put("isadmin", user.getIsadmin());
                response.put("success", true);
                
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Nom d'utilisateur ou mot de passe incorrect");
                response.put("success", false);
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Erreur d'authentification: " + e.getMessage());
            response.put("success", false);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping(value="/get/{uid}", produces="application/json")
    public ResponseEntity<?> getUser(@PathVariable int uid) {
        try {
            User user = userservice.fetchUserById(uid);
            user.setPassword(null); // Ne pas envoyer le mot de passe
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (UserException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Déconnexion réussie");
        response.put("success", true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}