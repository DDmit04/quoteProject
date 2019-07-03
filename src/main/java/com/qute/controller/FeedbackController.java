package com.qute.controller;

import com.qute.data.Feedback;
import com.qute.repo.FeedbackRepo;
import com.qute.service.MailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.regex.Pattern;

@RestController
@RequestMapping("feedback")
public class FeedbackController {

    private static final Pattern checkEmail = Pattern.compile(
            "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
    );

    private MailSender mailSender;
    private FeedbackRepo feedbackRepo;

    @Autowired
    public FeedbackController(MailSender mailSender, FeedbackRepo feedbackRepo) {
        this.mailSender = mailSender;
        this.feedbackRepo = feedbackRepo;
    }

    @PostMapping()
    public Feedback getFeedback(@RequestBody Feedback feedback) {
        Feedback savedFeedback = feedbackRepo.save(feedback);
        if(!feedback.getFeedbackText().equals("")
                && !feedback.getEmail().equals("")
                && checkEmail.matcher(feedback.getEmail()).matches()) {
            mailSender.send("orderly chaos feedback from " + feedback.getEmail(), feedback.getFeedbackText());
        }
        return savedFeedback;
    }
}
