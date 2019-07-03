package com.qute.repo;

import com.qute.data.Feedback;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.repository.CrudRepository;

@Configuration
public interface FeedbackRepo extends CrudRepository<Feedback, Long> {

}
