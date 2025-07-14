import re
import datetime
def generate_formatted_name(input_string: str) -> str:
    """
    Takes a string, removes special characters (except spaces and underscores),
    converts it to lowercase, replaces spaces with underscores,
    and appends a formatted timestamp.

    Args:
        input_string: The initial string to process.

    Returns:
        A formatted string like 'text_text_ddmmyyHHMMSS'.
    """
    
    sanitized_text = re.sub(r'[^a-zA-Z0-9_ ]', '', input_string)

    
    processed_text = sanitized_text.lower().replace(' ', '_')

    
    timestamp = datetime.datetime.now().strftime("%d%m%y%H%M%S")

    
    final_name = f"{processed_text}_{timestamp}"

    return final_name