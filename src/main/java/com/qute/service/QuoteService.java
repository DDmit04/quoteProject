package com.qute.service;

import com.qute.data.User;
import com.qute.data.quote.ApiQuote;
import com.qute.data.quote.QuoteCoreData;
import com.qute.data.quote.QuoteRatesDto;
import com.qute.data.quote.UserQuote;
import com.qute.repo.ApiQuoteRepo;
import com.qute.repo.UserQuoteRepo;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class QuoteService {

    private ApiQuoteRepo apiQuoteRepo;
    private UserQuoteRepo userQuoteRepo;

    public QuoteService(ApiQuoteRepo quoteRepo, UserQuoteRepo userQuoteRepo) {
        this.userQuoteRepo = userQuoteRepo;
        this.apiQuoteRepo = quoteRepo;
    }

    public QuoteRatesDto getQuoteRatesDto(QuoteCoreData quote) {
        QuoteRatesDto rates = new QuoteRatesDto(
                quote.getQuotePluses().size(),
                quote.getQuoteMedium().size(),
                quote.getQuoteMinuses().size(),
                quote.getId()
        );
        return rates;
    }

    private void cleanUserRate(User user, QuoteCoreData quote, String exclusion) {
        Set<User> quotePluses = quote.getQuotePluses();
        Set<User> quoteMedium = quote.getQuoteMedium();
        Set<User> quoteMinuses = quote.getQuoteMinuses();
        if(quotePluses.contains(user) && !exclusion.equals("like")) {
            quotePluses.remove(user);
        }
        if(quoteMedium.contains(user) && !exclusion.equals("medium")) {
            quoteMedium.remove(user);
        }
        if(quoteMinuses.contains(user) && !exclusion.equals("minus")) {
            quoteMinuses.remove(user);
        }
    }

    public ApiQuote saveApiQuote(ApiQuote quote) {
        quote.setOriginalServerKey(quote.getQuoteLink().split("/")[4]);
        ApiQuote savedQuote = apiQuoteRepo.findByOriginalKey(quote.getOriginalServerKey());
        if(savedQuote == null) {
            savedQuote = apiQuoteRepo.save(quote);
        }
        return savedQuote;
    }

    public UserQuote saveUserQuote(UserQuote quote) {
        return userQuoteRepo.save(quote);
    }

    public QuoteRatesDto plusQuote(User user, QuoteCoreData quote) {
        if(user != null) {
            cleanUserRate(user, quote, "like");
            Set<User> quotePluses = quote.getQuotePluses();
            if(quotePluses.contains(user)) {
                quotePluses.remove(user);
            } else {
                quotePluses.add(user);
            }
        }
        return getQuoteRatesDto(quote);
    }

    public QuoteRatesDto mediumQuote(User user, QuoteCoreData quote) {
        if(user != null) {
            cleanUserRate(user, quote, "medium");
            Set<User> quoteMedium = quote.getQuoteMedium();
            if(quoteMedium.contains(user)) {
                quoteMedium.remove(user);
            } else {
                quoteMedium.add(user);
            }
        }
        return getQuoteRatesDto(quote);
    }

    public QuoteRatesDto minusQuote(User user, QuoteCoreData quote) {
        if(user != null) {
            cleanUserRate(user, quote, "minus");
            Set<User> quoteMinuses = quote.getQuoteMinuses();
            if(quoteMinuses.contains(user)) {
                quoteMinuses.remove(user);
            } else {
                quoteMinuses.add(user);
            }
        }
        return getQuoteRatesDto(quote);
    }

}
