package com.qute.controller.quote;

import com.qute.data.quote.QuoteRatesDto;
import com.qute.data.User;
import com.qute.data.quote.UserQuote;
import com.qute.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("quotes/userQuote/")
public class UserQuoteController {

    private QuoteService quoteService;

    @Autowired
    public UserQuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @GetMapping("plus/{userQuote}")
    public QuoteRatesDto plusApiQuote(@AuthenticationPrincipal User user,
                                      @PathVariable UserQuote userQuote) {
        return quoteService.plusQuote(user, userQuote);
    }

    @GetMapping("medium/{userQuote}")
    public QuoteRatesDto mediumApiQuote(@AuthenticationPrincipal User user,
                                        @PathVariable UserQuote userQuote) {
        return quoteService.mediumQuote(user, userQuote);

    }

    @GetMapping("minus/{userQuote}")
    public QuoteRatesDto minusApiQuote(@AuthenticationPrincipal User user,
                                       @PathVariable UserQuote userQuote) {
        return quoteService.minusQuote(user, userQuote);

    }
}
