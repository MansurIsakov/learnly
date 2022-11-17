export interface ExamInput {
  exams: IExam[];
  owner?: string;
}

export interface IExam {
  id: string;
  examDate: string;
  examType: string;
  examModule: string;
  isPassed: boolean;
}
