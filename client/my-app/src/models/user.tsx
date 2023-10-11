export interface ICourse {
    _id: string;
    name: string;
    quiz: IQuizItem[];
  }
  
  export interface IQuizItem {
    _id: string;
    question: string;
    answer: string;
  }