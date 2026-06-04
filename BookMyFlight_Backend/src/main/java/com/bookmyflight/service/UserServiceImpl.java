package com.bookmyflight.service;

import java.util.Base64;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bookmyflight.bean.Login;
import com.bookmyflight.entity.User;
import com.bookmyflight.exception.UserException;
import com.bookmyflight.repo.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userrepo;
    
    // Méthode pour encoder le mot de passe
    private String encodePassword(String password) {
        return Base64.getEncoder().encodeToString(password.getBytes());
    }
    
    // Méthode pour décoder le mot de passe (pour affichage uniquement)
    private String decodePassword(String encodedPassword) {
        return new String(Base64.getDecoder().decode(encodedPassword));
    }
    
    @Override
    public int createUser(User user) throws UserException {
        // Vérifier si l'utilisateur existe déjà
        List<User> users = userrepo.findAll();
        
        for(User u : users) {
            if(u.getUsername().equals(user.getUsername())) {
                throw new UserException("Ce nom d'utilisateur existe déjà");
            }
            if(u.getEmail().equals(user.getEmail())) {
                throw new UserException("Cet email est déjà utilisé");
            }
        }
        
        // Encoder le mot de passe avant de sauvegarder
        String encodedPassword = encodePassword(user.getPassword());
        user.setPassword(encodedPassword);
        
        // Sauvegarder l'utilisateur
        User savedUser = userrepo.save(user);
        return savedUser.getUserId();
    }

    @Override
    public User fetchUserById(int user_id) throws UserException {
        Optional<User> userOpt = userrepo.findById(user_id);
        if(userOpt.isPresent()) {
            User user = userOpt.get();
            // Décoder le mot de passe pour l'affichage (optionnel)
            user.setPassword(decodePassword(user.getPassword()));
            return user;
        } else {
            throw new UserException("Utilisateur non trouvé avec l'ID: " + user_id);
        }
    }

    @Override
    public User validate(Login login) {
        // Encoder le mot de passe fourni pour le comparer avec celui en base
        String encodedInputPassword = encodePassword(login.getPassword());
        User user = userrepo.findByUsernameAndPassword(login.getUsername(), encodedInputPassword);
        
        if(user != null) {
            // Décoder pour l'affichage (ne pas garder en session)
            user.setPassword(login.getPassword());
        }
        return user;
    }
    
    @Override
    public Collection<User> fetchAllUsers() {
        List<User> users = userrepo.findAll();
        // Ne pas décoder les mots de passe pour la liste
        return users;
    }
}