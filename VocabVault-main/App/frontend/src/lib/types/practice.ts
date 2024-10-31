

export interface Card {
    id: string;
    source: string;
    target: string;
    pos: string;
    definition: string;
    pronunciation: string;
  }

export interface CardSet {
    id: string;
    title: string;
    private: boolean;
    created_by: string;
    card_data: (Card | string)[];
    language: string;
    length: number;
  }