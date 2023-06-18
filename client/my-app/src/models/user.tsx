export interface ICourse {
    name: string;
    quiz: IQuizItem[];
  }
  
  export interface IQuizItem {
    question: string;
    answer: string;
  }