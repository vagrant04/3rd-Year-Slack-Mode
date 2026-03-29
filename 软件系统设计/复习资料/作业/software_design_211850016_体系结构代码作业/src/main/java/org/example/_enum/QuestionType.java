package org.example._enum;

import lombok.Getter;
import org.example.factory.question.CodeQuestionFactory;
import org.example.factory.question.MultiSelectQuestionFactory;
import org.example.factory.question.QuestionFactory;
import org.example.factory.question.SingleSelectQuestionFactory;

import java.util.HashMap;
import java.util.Map;

@Getter
public enum QuestionType {
  SINGLE_SELECT(1L, new SingleSelectQuestionFactory()),
  MULTIPLE_SELECT(2L, new MultiSelectQuestionFactory()),
  CODE(3L, new CodeQuestionFactory());

  private static final Map<Long, QuestionFactory> factoryMap = new HashMap<>();

  static {
    for (QuestionType type : QuestionType.values()) {
      factoryMap.put(type.id, type.factory);
    }
  }

  final Long id;
  final QuestionFactory factory;

  QuestionType(Long id, QuestionFactory factory) {
    this.id = id;
    this.factory = factory;
  }

  public static QuestionFactory getFactoryById(Long id) {
    QuestionFactory factory = factoryMap.get(id);
    if (factory == null) {
      throw new IllegalArgumentException("Invalid question type id: " + id);
    }
    return factory;
  }
}