-- Answers from plain /hi (no card number) are filed under card_number 0.
alter table public.answers drop constraint if exists answers_card_number_check;
alter table public.answers add constraint answers_card_number_check check (card_number between 0 and 100);
