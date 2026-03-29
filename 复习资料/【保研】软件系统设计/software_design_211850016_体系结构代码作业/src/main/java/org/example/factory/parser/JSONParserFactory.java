package org.example.factory.parser;

import lombok.SneakyThrows;
import org.example._enum.QuestionType;
import org.example.pojo.Exam;
import org.example.pojo.Submission;
import org.example.pojo.question.Question;
import org.json.JSONObject;

import java.nio.file.Files;
import java.nio.file.Paths;

public class JSONParserFactory extends ParserFactory {
  @Override
  @SneakyThrows
  public Exam parseExam(String path) {
    String content = new String(Files.readAllBytes(Paths.get(path)));
    JSONObject json = new JSONObject(content);
    Long id = json.getLong("id");
    String title = json.getString("title");
    Long startTime = json.getLong("startTime");
    Long endTime = json.getLong("endTime");
    Question[] questions = new Question[json.getJSONArray("questions").length()];
    for (int i = 0; i < questions.length; i++) {
      JSONObject question = json.getJSONArray("questions").getJSONObject(i);
      questions[i] = QuestionType.getFactoryById(question.getLong("type")).create(question);
    }
    return new Exam(id, title, startTime, endTime, questions);
  }

  @Override
  @SneakyThrows
  public Submission parseSubmission(String path) {
    return new Submission(new JSONObject(new String(Files.readAllBytes(Paths.get(path)))));
  }
}
