package com.qute.controller;

import com.qute.data.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class mainController {

    @GetMapping
    public String main(@AuthenticationPrincipal User user,
                        Model model) {
        model.addAttribute("userAuth", user);
        return "index";
    }
}
