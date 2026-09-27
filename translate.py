import re
import time
from deep_translator import GoogleTranslator

# We will use google translator API without limits via deep_translator
translator = GoogleTranslator(source='pt', target='en')

file_path = 'src/data/automationDetailData.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Match standard fields: title, description, rationale, etc.
prop_pattern = re.compile(r'(title|description|summaryText|volumetrySummary|rationale|name|objective|processName|sopTitle|label|full):\s*"([^"\\]*(?:\\.[^"\\]*)*)"')
# Match contextCards
cards_pattern = re.compile(r'contextCards:\s*\[([^\]]*)\]')
string_pattern = re.compile(r'"([^"\\]*(?:\\.[^"\\]*)*)"')

replacements = []

def do_translate(text):
    ignore_list = ["Intake", "Routing", "Execution", "Exception", "Codification", "RPA", "Workflow", "IA / Agente", "Analytics", "Evaluator"]
    if text in ignore_list:
        return text
    try:
        res = translator.translate(text)
        return res if res else text
    except Exception as e:
        print(f"Error translating: {text} - {e}")
        return text

# Find properties
for match in prop_pattern.finditer(content):
    key = match.group(1)
    original_text = match.group(2)
    
    translated = do_translate(original_text)
    new_str = f'{key}: "{translated.replace(\'"\', \'\\\\"\')}"'
    
    replacements.append({
        'start': match.start(),
        'end': match.end(),
        'newStr': new_str
    })

# Find cards
for array_match in cards_pattern.finditer(content):
    array_content = array_match.group(1)
    offset = array_match.start() + content[array_match.start():array_match.end()].find('[') + 1
    
    for str_match in string_pattern.finditer(array_content):
        original_text = str_match.group(1)
        translated = do_translate(original_text)
        new_str = f'"{translated.replace(\'"\', \'\\\\"\')}"'
        
        replacements.append({
            'start': offset + str_match.start(),
            'end': offset + str_match.end(),
            'newStr': new_str
        })

print(f"Total translations to apply: {len(replacements)}")

# Apply from end to start
replacements.sort(key=lambda x: x['start'], reverse=True)

final_content = content
for rep in replacements:
    final_content = final_content[:rep['start']] + rep['newStr'] + final_content[rep['end']:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Translation completed successfully!")
