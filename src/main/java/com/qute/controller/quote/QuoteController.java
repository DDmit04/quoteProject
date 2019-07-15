package com.qute.controller.quote;

import com.qute.data.quote.ApiQuote;
import com.qute.data.quote.QuoteRatesDto;
import com.qute.data.quote.UserQuote;
import com.qute.repo.ApiQuoteRepo;
import com.qute.repo.UserQuoteRepo;
import com.qute.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("quotes")
public class QuoteController {

    private QuoteService quoteService;

    @Autowired
    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @PostMapping("/apiQuote")
    public QuoteRatesDto downloadApiQuote(@RequestBody ApiQuote quote) {
        ApiQuote savedQuote = quoteService.saveApiQuote(quote);
        QuoteRatesDto quoteRates = quoteService.getQuoteRatesDto(savedQuote);
        return quoteRates;
    }

    @PostMapping("/userQuote")
    public UserQuote downloadUserQuote(@RequestBody UserQuote quote) {
        UserQuote savedQuote = quoteService.saveUserQuote(quote);
        return savedQuote;

    }

}
