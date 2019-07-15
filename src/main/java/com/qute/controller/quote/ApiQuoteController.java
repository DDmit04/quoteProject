package com.qute.controller.quote;

import com.qute.data.quote.ApiQuote;
import com.qute.data.quote.QuoteRatesDto;
import com.qute.data.User;
import com.qute.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("quotes/apiQuote/")
public class ApiQuoteController {

    private QuoteService quoteService;

    @Autowired
    public ApiQuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @GetMapping("plus/{apiQuote}")
    public QuoteRatesDto plusApiQuote(@AuthenticationPrincipal User user,
                                      @PathVariable ApiQuote apiQuote) {
        return quoteService.plusQuote(user, apiQuote);
    }

    @GetMapping("medium/{apiQuote}")
    public QuoteRatesDto mediumApiQuote(@AuthenticationPrincipal User user,
                                        @PathVariable ApiQuote apiQuote) {
        return quoteService.mediumQuote(user, apiQuote);
    }

    @GetMapping("minus/{apiQuote}")
    public QuoteRatesDto minusApiQuote(@AuthenticationPrincipal User user,
                                       @PathVariable ApiQuote apiQuote) {
        return quoteService.minusQuote(user, apiQuote);
    }
}
