import random
import uuid

from .models import CardSet

class TempCardSet:
    def __init__(self, id, title, created_by, private, language, cards):
        self.id = id
        self.title = title
        self.created_by = created_by
        self.private = private
        self.language = language
        self.card_data = cards

def createTempCardSet(account, num_cards):
    # Calculate the number of cards for each progress range
    low_progress_count = random.randint(int(0.3 * num_cards), int(0.4 * num_cards))
    mid_progress_count = random.randint(int(0.3 * num_cards), int(0.5 * num_cards))
    high_progress_count = num_cards - low_progress_count - mid_progress_count

    # Get cards for each progress range
    low_progress_cards = list(account.get_cards_by_progress_range(0, 2))
    mid_progress_cards = list(account.get_cards_by_progress_range(3, 4))
    high_progress_cards = list(account.get_cards_by_progress_range(5, 5))

    # Randomly select cards from each range
    selected_cards = (
        random.sample(low_progress_cards, min(low_progress_count, len(low_progress_cards))) +
        random.sample(mid_progress_cards, min(mid_progress_count, len(mid_progress_cards))) +
        random.sample(high_progress_cards, min(high_progress_count, len(high_progress_cards)))
    )

    # If we don't have enough cards, fill with available cards from other ranges
    if len(selected_cards) < num_cards:
        remaining_cards = list(set(low_progress_cards + mid_progress_cards + high_progress_cards) - set(selected_cards))
        selected_cards += random.sample(remaining_cards, min(num_cards - len(selected_cards), len(remaining_cards)))

    # Shuffle the selected cards
    random.shuffle(selected_cards)

    # Extract the actual Card objects and languages
    cards = [vocab.word for vocab in selected_cards]
    languages = set(card.target_language for card in cards if card.target_language)

    # Create a temporary CardSet instance (not saved to database)
    # temp_card_set = CardSet(
    #     id=uuid.uuid4(),
    #     title=f"Temporary Set for {account.user.username}",
    #     created_by=account,
    #     private=True,
    #     language=list(languages)[0] if len(languages) == 1 else None
    # )
    temp_card_set = TempCardSet(
        id=uuid.uuid4(),
        title=f"Temporary Set for {account.user.username}",
        created_by=account,
        private=True,
        language=list(languages)[0] if len(languages) == 1 else None,
        cards=cards
    )

    print("Temporary CardSet created:", temp_card_set.title)
    print(f"Added {len(cards)} cards to the temporary CardSet")


    print("Yo mr")
    print(temp_card_set)
    return temp_card_set
    