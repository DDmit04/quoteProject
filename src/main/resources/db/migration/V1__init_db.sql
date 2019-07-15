create sequence hibernate_sequence start 1 increment 1;

create table api_quote (
    id                  int8 not null,
    quote_author        varchar(255),
    quote_language      varchar(255),
    quote_link          varchar(255),
    quote_text          varchar(512), --was 255--
    sender_link         varchar(255),
    original_server_key varchar(255),
    primary key (id)
);
create table api_quote_quote_medium (
    api_quote_id    int8         not null,
    quote_medium_id varchar(255) not null,
    primary key (api_quote_id, quote_medium_id)
);
create table api_quote_quote_minuses (
    api_quote_id     int8         not null,
    quote_minuses_id varchar(255) not null,
    primary key (api_quote_id, quote_minuses_id)
);
create table api_quote_quote_pluses (
    api_quote_id    int8         not null,
    quote_pluses_id varchar(255) not null,
    primary key (api_quote_id, quote_pluses_id)
);
create table feedback (
    id            int8 not null,
    email         varchar(255),
    feedback_text varchar(255),
    primary key (id)
);
create table user_quote (
    id             int8 not null,
    quote_author   varchar(255),
    quote_language varchar(255),
    quote_link     varchar(255),
    quote_text     varchar(512), --was 255--
    sender_link    varchar(255),
    primary key (id)
);
create table user_quote_quote_medium (
    user_quote_id   int8         not null,
    quote_medium_id varchar(255) not null,
    primary key (user_quote_id, quote_medium_id)
);
create table user_quote_quote_minuses (
    user_quote_id    int8         not null,
    quote_minuses_id varchar(255) not null,
    primary key (user_quote_id, quote_minuses_id)
);
create table user_quote_quote_pluses (
    user_quote_id   int8         not null,
    quote_pluses_id varchar(255) not null,
    primary key (user_quote_id, quote_pluses_id)
);
create table usr (
    id    varchar(255) not null,
    email varchar(255),
    name  varchar(255),
    primary key (id)
);
alter table if exists api_quote_quote_medium
    add constraint FK1egmw3xlr0c5s5wk4yhdutpja foreign key (quote_medium_id) references usr;
alter table if exists api_quote_quote_medium
    add constraint FKehb2t1d2tdj5lgty9tewm9cv4 foreign key (api_quote_id) references api_quote;
alter table if exists api_quote_quote_minuses
    add constraint FK3nw4qwrkgqeecafgps25ppvy2 foreign key (quote_minuses_id) references usr;
alter table if exists api_quote_quote_minuses
    add constraint FKf03dj9rb94vb7mf066dp2pta4 foreign key (api_quote_id) references api_quote;
alter table if exists api_quote_quote_pluses
    add constraint FKg9gkrabp3r0fw7a9etm9jsfhl foreign key (quote_pluses_id) references usr;
alter table if exists api_quote_quote_pluses
    add constraint FKro6eyuo74tpv33q3i53bq7owk foreign key (api_quote_id) references api_quote;
alter table if exists user_quote_quote_medium
    add constraint FKmn6ki4xnijev0fr5ohnbsl91k foreign key (quote_medium_id) references usr;
alter table if exists user_quote_quote_medium
    add constraint FKm7k94is9vmnp13txv9codyua8 foreign key (user_quote_id) references user_quote;
alter table if exists user_quote_quote_minuses
    add constraint FK777hor58ri459u3ccnfnyu8kc foreign key (quote_minuses_id) references usr;
alter table if exists user_quote_quote_minuses
    add constraint FKpr00g99800y3pf468psbcvpb6 foreign key (user_quote_id) references user_quote;
alter table if exists user_quote_quote_pluses
    add constraint FK947otwby7r2f1fl5slkuuu1oh foreign key (quote_pluses_id) references usr;
alter table if exists user_quote_quote_pluses
    add constraint FKlpfu4eq70xc6u91r9v96pihwy foreign key (user_quote_id) references user_quote;