type QuestionType = 'text' | 'date' | 'radio' | 'textarea' | 'descriptionBlock';

interface Question {
    id: string | number;
    question: string;
    type: QuestionType;
    options?: string[];
}

export interface Section {
    section: string;
    questions: Question[];
}

export interface Answers {
    childName?: string;
    childDOB?: string;
    childGender?: string;
    parentName?: string;
    emotionalState?: string;
    [key: string]: string | undefined;
}
