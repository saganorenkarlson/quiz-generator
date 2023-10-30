export interface IQuiz {
    _id: string;
    name: string;
    quiz: IQuizItem[];
    createdBy: {username: string, id: string};
    public: boolean;
  }
  
  export interface IQuizItem {
    _id: string;
    question: string;
    answer: string;
  }