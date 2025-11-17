package com.mypeak.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.AnswerPreCheckoutQuery;
import org.telegram.telegrambots.meta.api.methods.send.SendInvoice;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendPhoto;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.payments.LabeledPrice;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class MyPeakBot extends TelegramLongPollingBot {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.bot.username}")
    private String botUsername;

    @Value("${telegram.admin.chatid}")
    private long adminChatId;

    private Map<Long, String> userStates = new HashMap<>();

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public void onUpdateReceived(Update update) {
        System.out.println("Received update");
        String lang = (update.hasMessage() && update.getMessage().getFrom() != null) ?
                update.getMessage().getFrom().getLanguageCode() : "en";
        System.out.println("Lang: " + lang);

        if (update.hasPreCheckoutQuery()) {
            AnswerPreCheckoutQuery answer = new AnswerPreCheckoutQuery();
            answer.setPreCheckoutQueryId(update.getPreCheckoutQuery().getId());
            answer.setOk(true);
            try {
                execute(answer);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
            return;
        } else if (update.hasMessage() && update.getMessage().hasSuccessfulPayment()) {
            SendMessage thankYou = new SendMessage();
            thankYou.setChatId(String.valueOf(update.getMessage().getChatId()));
            thankYou.setText((lang != null && lang.startsWith("ru")) ?
                    "Спасибо за поддержку! Ваш донат вдохновляет нас развивать MyPeak. Ждем ваших отзывов и идей! ❤️" :
                    "Thank you for your support! Your donation inspires us to develop MyPeak. We look forward to your reviews and ideas! ❤️");
            try {
                execute(thankYou);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
            return;
        }

        if (!update.hasMessage()) {
            return;
        }

        long chatId = update.getMessage().getChatId();
        String currentState = userStates.getOrDefault(chatId, "default");

        if (currentState.equals("waiting_support")) {
            boolean hasContent = false;
            if (update.getMessage().hasText()) {
                String userText = update.getMessage().getText();
                SendMessage toAdmin = new SendMessage();
                toAdmin.setChatId(String.valueOf(adminChatId));
                toAdmin.setText("Support from " + chatId + ": " + userText);
                try {
                    execute(toAdmin);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
                hasContent = true;
            }
            if (update.getMessage().hasPhoto()) {
                SendPhoto toAdminPhoto = new SendPhoto();
                toAdminPhoto.setChatId(String.valueOf(adminChatId));
                toAdminPhoto.setPhoto(new InputFile(update.getMessage().getPhoto().get(update.getMessage().getPhoto().size() - 1).getFileId()));
                String caption = update.getMessage().getCaption();
                toAdminPhoto.setCaption("Support photo from " + chatId + (caption != null ? ": " + caption : ""));
                try {
                    execute(toAdminPhoto);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
                hasContent = true;
            }
            if (hasContent) {
                SendMessage confirm = new SendMessage();
                confirm.setChatId(String.valueOf(chatId));
                confirm.setText((lang != null && lang.startsWith("ru")) ?
                        "Сообщение отправлено поддержке." :
                        "Message sent to support.");
                try {
                    execute(confirm);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
                userStates.remove(chatId);
            }
            return;
        }

        if (update.getMessage().hasText()) {
            String text = update.getMessage().getText();
            System.out.println("Text: " + text);
            if (text.startsWith("/start")) {
                SendMessage message = new SendMessage();
                message.setChatId(String.valueOf(chatId));
                message.setParseMode("HTML");
                message.setText((lang != null && lang.startsWith("ru")) ?
                        "Привет! 🚀 Добро пожаловать в MyPeak. Мы — маленькая команда энтузиастов, создаём честный инструмент для сообщества, фокусируясь на персонализации и прозрачности.\n" +
                                "\n" +
                                "<b>Крутые фишки:</b>\n" +
                                "- Ищи игры из Steam, ставь оценки (1-100) и делись отзывами.\n" +
                                "- Смотри популярные в аппе, топ-оценённые за всё время.\n" +
                                "- Верифицируем владение в Steam — твои отзывы станут супер-влиятельными.\n" +
                                "- Объективная оценка: взвешенное среднее для справедливости.\n" +
                                "\n" +
                                "<b>Из чего складывается оценка?</b>\n" +
                                "Оценка игры — это среднее от всех баллов, но с акцентом на \"вес\" отзыва. Больше веса у длинных отзывов, у тех, кто много играл, завершил игру или доказал владение (в 10 раз больше!). Так фейки и спам не рулят, а настоящие мнения — да.\n" +
                                "\n" +
                                "<b>Формула для тех, кто любит детали:</b>\n" +
                                "Общая оценка = ∑(балл * вес) / ∑вес\n" +
                                "Вес = 1 + 0.001 * log(длина_текста + 1) + 0.01 * √(часы_в_игре) + (завершена? 0.5 : 0)\n" +
                                "Если верифицировано — вес × 10.\n" +
                                "\n" +
                                "Начни прямо сейчас: найди игру и поделись мнением! 💬 Мы всегда на связи для фидбека." :
                        "Hello! 🚀 Welcome to MyPeak. We are a small team of enthusiasts creating an honest tool for the community, focusing on personalization and transparency.\n" +
                                "\n" +
                                "<b>Cool features:</b>\n" +
                                "- Search for games from Steam, rate them (1-100) and share reviews.\n" +
                                "- View popular in the app, top-rated of all time.\n" +
                                "- Verify ownership in Steam — your reviews will become super-influential.\n" +
                                "- Objective rating: weighted average for fairness.\n" +
                                "\n" +
                                "<b>What makes up the rating?</b>\n" +
                                "The game rating is the average of all scores, but with emphasis on the \"weight\" of the review. More weight for long reviews, for those who played a lot, completed the game or proved ownership (10 times more!). So fakes and spam don't rule, but real opinions do.\n" +
                                "\n" +
                                "<b>Formula for those who love details:</b>\n" +
                                "Overall rating = ∑(score * weight) / ∑weight\n" +
                                "Weight = 1 + 0.001 * log(text_length + 1) + 0.01 * √(hours_in_game) + (completed? 0.5 : 0)\n" +
                                "If verified — weight × 10.\n" +
                                "\n" +
                                "Start right now: find a game and share your opinion! 💬 We are always in touch for feedback.");
                try {
                    execute(message);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
            } else if (text.equals("/donate")) {
                SendInvoice invoice = new SendInvoice();
                invoice.setChatId(String.valueOf(chatId));
                invoice.setTitle((lang != null && lang.startsWith("ru")) ? "Поддержите MyPeak" : "Support MyPeak");
                invoice.setDescription((lang != null && lang.startsWith("ru")) ? "Пожертвование на развитие бота" : "Donation for bot development");
                invoice.setPayload("donate_payload");
                invoice.setProviderToken("x");
                invoice.setCurrency("XTR");
                invoice.setPrices(List.of(new LabeledPrice((lang != null && lang.startsWith("ru")) ? "Донат" : "Donate", 100)));
                try {
                    execute(invoice);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
            } else if (text.equals("/support")) {
                userStates.put(chatId, "waiting_support");
                SendMessage prompt = new SendMessage();
                prompt.setChatId(String.valueOf(chatId));
                prompt.setText((lang != null && lang.startsWith("ru")) ?
                        "Отправьте ваше сообщение и фото (если нужно)." :
                        "Send your message and photo (if needed).");
                try {
                    execute(prompt);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}