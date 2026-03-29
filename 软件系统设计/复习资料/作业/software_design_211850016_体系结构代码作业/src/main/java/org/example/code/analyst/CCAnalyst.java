package org.example.code.analyst;

import java.nio.file.Path;
import java.util.concurrent.Callable;

public abstract class CCAnalyst implements Callable<Object> {

  Long ExamId;
  Long StuId;
  Path path;

  public CCAnalyst(Path path) {
    this.path = path;
  }

}
