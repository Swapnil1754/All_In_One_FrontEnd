package com.example.RegistrationService.Controller;

import com.example.RegistrationService.Domain.User;
import com.example.RegistrationService.Exceptions.UserAlreadyExistsException;
import com.example.RegistrationService.Exceptions.UserNotFoundException;
import com.example.RegistrationService.Service.JwtSecurityTokenGenerator;
import com.example.RegistrationService.Service.MaskData;
import com.example.RegistrationService.Service.MaskService;
import com.example.RegistrationService.Service.RegistrationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.xmlbeans.impl.xb.xsdschema.PatternDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/v1")
public class RegistrationController {
    private RegistrationService registrationService;
    private ResponseEntity responseEntity;
    private JwtSecurityTokenGenerator tokenGenerator;
@Autowired
    public RegistrationController(RegistrationService registrationService, JwtSecurityTokenGenerator tokenGenerator, MaskService maskService) {
        this.registrationService = registrationService;
        this.tokenGenerator = tokenGenerator;
    }
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) throws IOException, UserAlreadyExistsException {
        String srtData = MaskData.maskFun(user);
        ObjectMapper objectMapper = new ObjectMapper();
        User user1 = objectMapper.readValue(srtData, User.class);
        System.out.println(user1);
    try {
        responseEntity=new ResponseEntity<>(registrationService.registerUser(user1), HttpStatus.OK);
    }catch (UserAlreadyExistsException e) {
        throw new UserAlreadyExistsException("user Already Exists...");
    }catch(Exception e){
        throw new RuntimeException();
    }
    return responseEntity;
    }
    @PostMapping("/login/{userId}")
    public ResponseEntity<User> login(@PathVariable String userId, @RequestParam(name = "password") String password) throws UserNotFoundException {
    try {
        responseEntity = new ResponseEntity<>(tokenGenerator.generateToken(registrationService.findUser(userId,password)), HttpStatus.OK);
    }catch (UserNotFoundException e){
        throw new UserNotFoundException("User Does Not Exists in System...!!!"+e.getMessage());
    }catch (Exception e) {
        throw new RuntimeException();
    }
    return responseEntity;
    }
    @GetMapping("/fetch/{userId}")
    public ResponseEntity<User> fetchUser(@PathVariable String userId) throws UserNotFoundException {
        return new ResponseEntity<>(registrationService.fetchUser(userId), HttpStatus.OK);
    }
    @GetMapping(path = "/google")
    public ResponseEntity<User> getUserByEmailId(@RequestParam String token) throws UserNotFoundException, JsonProcessingException {
    return new ResponseEntity<>(registrationService.getUserByToken(token), HttpStatus.OK);
    }
    @GetMapping(path = "/facebook")
    public ResponseEntity<User> getUserByName(@RequestParam String email) throws UserNotFoundException {
    return new ResponseEntity<>(registrationService.getUserByEmail(email), HttpStatus.OK);
    }
    @PutMapping("/forget-password/{userName}")
    public ResponseEntity<?> forgetPassword(@PathVariable String userName, @RequestParam(name = "password") String password) {
    String email = "", mobile = "";
    Pattern pattern = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    Matcher matcher = pattern.matcher(userName);
    if(matcher.find()) {
        email = userName;
    } else{
        mobile = userName;
    }
    return new ResponseEntity<>(registrationService.updatePassword(email, mobile, password), HttpStatus.OK);
    }
    @PutMapping("/update/profile")
    public ResponseEntity<Optional<User>> updateUserProfile(@RequestBody User user) {
    return new ResponseEntity<>(registrationService.updateUserProfile(user), HttpStatus.OK);
    }

}
