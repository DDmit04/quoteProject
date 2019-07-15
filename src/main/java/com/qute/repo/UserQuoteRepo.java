package com.qute.repo;

import com.qute.data.quote.UserQuote;
import org.springframework.data.repository.CrudRepository;

public interface UserQuoteRepo extends CrudRepository<UserQuote, Long> {
}
