package com.qute.data.quote;

import com.qute.data.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@MappedSuperclass
@Getter
@Setter
public abstract class QuoteCoreData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String quoteAuthor;
    private String quoteLink;
    private String quoteText;
    private String senderLink;
    private String quoteLanguage;

    @ManyToMany(fetch = FetchType.LAZY)
    private Set<User> quotePluses = new HashSet<>();
    @ManyToMany(fetch = FetchType.LAZY)
    private Set<User> quoteMedium = new HashSet<>();
    @ManyToMany(fetch = FetchType.LAZY)
    private Set<User> quoteMinuses = new HashSet<>();

}