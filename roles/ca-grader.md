# Course Assistant Grading Procedure

## Setup

A Google Sheet holds a calendar for the semester that keeps track of the problem sets and its problems, their grading dates, the CA grader responsible for problems, and the TA responsible for checking the grading. When the semester starts, the CA will be asked for any weeks they would like *not* to grade by the grading coordinator. This should be reflected in the calendar. Every CA should grade a similar amount of problems throughout the semester.

## Grading

Every Tuesday, an email will be sent from the grading coordinator notifying them that it's time for them to grade. Detailed instructions on how to do so will be given in this email.

### Suspicious submissions

Flagging should be done liberally rather than conservatively. Any instance of suspected cheating or plagiarism, like code way above the expected knowledge of the students, methods/functions that haven't been covered, identical solutions on non-pair-optional problems, etc. should be flagged. This can be done with the `-0.0` rubric item, often labeled as either just a period `.` or the word `FLAG`.

### Resubmitting code submissions

If there is a small issue with the code that prevents the autograder from being able to run, such as incorrect indentations, syntax errors, unmatched quotation marks, etc., the grader should follow the procedure below:

1) Hover over the number on the bottom left to reveal the name of the student.
2) Open the sidebar on the left side of the screen and navigate to `Manage Submissions`.
3) On the top right search bar, search for the student and open their submission.
4) On the bottom, select `Download Submission`. Unzip the `.zip` file and navigate to the submission. Make any adjustments as needed such that the autograder can run (do not fix solutions!).
5) Back on Gradescope, if the problem is combined with another grader's problem (for example, `ps1` has `pr5` and `pr6` under the same submission), if the other grader has already graded this student's submission for their problem, take note of the rubric markings the other grader made.
6) On the bottom of the student's submission page, click `Resubmit`, and submit the edited files.
7) If you had to do step 5, navigate to the other problem under `Grade Submissions` on the left sidebar, and regrade based on the other grader's grading. Then navigate back to your own problem and finish grading, being sure to mark the appropriate rubric item for `could not test until minor syntax error was fixed`.

