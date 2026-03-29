package org.example.subject;

import org.example.observer.Observer;

import java.util.HashSet;
import java.util.Set;

public abstract class Subject {

  protected Set<Observer> observers = new HashSet<>();

  public void addObserver(Observer observer) {
    if (!observers.contains(observer)) {
      observers.add(observer);
    }
  }

  public void removeObserver(Observer observer) {
    observers.remove(observer);
  }

  public void notifyObservers() {
    for (Observer observer : observers) {
      observer.update(this);
    }
  }
}