package org.example.observer;

import org.example.subject.Subject;

public interface Observer {
  void update(Subject subject);
}
