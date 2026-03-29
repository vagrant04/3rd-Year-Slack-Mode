package org.example.factory.parser;

import lombok.SneakyThrows;
import org.example._enum.QuestionType;
import org.example.pojo.Exam;
import org.example.pojo.Submission;
import org.example.pojo.question.Question;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;

public class XMLParserFactory extends ParserFactory {
  @Override
  @SneakyThrows
  public Exam parseExam(String path) {
    Element root = new SAXBuilder().build(path).getRootElement();
    Long id = Long.parseLong(root.getChildText("id"));
    String title = root.getChildText("title");
    Long startTime = Long.parseLong(root.getChildText("startTime"));
    Long endTime = Long.parseLong(root.getChildText("endTime"));
    Element questionsElement = root.getChild("questions");
    Question[] questions = new Question[questionsElement.getChildren().size()];
    for (int i = 0; i < questions.length; i++) {
      Element questionElement = questionsElement.getChildren().get(i);
      questions[i] = QuestionType.getFactoryById(Long.parseLong(questionElement.getChildText("type")))
          .create(questionElement);
    }
    return new Exam(id, title, startTime, endTime, questions);
  }

  @Override
  @SneakyThrows
  public Submission parseSubmission(String path) {
    throw new UnsupportedOperationException("Not implemented yet");
  }
}