import requests
import urllib.parse
import xml.etree.ElementTree as ET
from langchain_core.tools import tool


def sentence_to_query_params(sentence):
    # Convert sentence to URL query parameters
    query_params = urllib.parse.urlencode({'q': sentence})
    return query_params.replace('q=', '')


def extract_first_document(xml_string):
    """
    Extract the first document from NLM search results XML.

    Args:
        xml_string (str): The XML string containing the search results

    Returns:
        dict: A dictionary containing the first document's information
    """
    # Parse the XML string
    root = ET.fromstring(xml_string)

    # Find the first document element
    first_doc = root.find('.//document[@rank="1"]')

    if first_doc is None:
        return None

    # Extract document information
    doc_info = {
        'url': first_doc.get('url'),
        'title': first_doc.find('.//content[@name="title"]').text,
        'organization': first_doc.find('.//content[@name="organizationName"]').text,
        'summary': first_doc.find('.//content[@name="FullSummary"]').text
    }

    # Try to get alternative titles if they exist
    alt_titles = first_doc.findall('.//content[@name="altTitle"]')
    if alt_titles:
        doc_info['alternative_titles'] = [title.text for title in alt_titles]

    return doc_info


@tool
def medical_query(query):
    '''The 'medical_query' tool is designed to handle questions related to medical terms, basic medicine information, and general health concepts. This tool focuses on providing factual information, definitions, or explanations related to medical terminology or common medications, without offering medical advice or treatment recommendations. It can be used for:

    Definitions of medical terms (e.g., conditions, procedures, symptoms)
    General information about medications (e.g., drug names, uses, side effects)
    Basic health concepts (e.g., what a specific medical condition entails)
    Clarifications of medical jargon or abbreviations
    '''
    query_params = sentence_to_query_params(query)
    url = f'https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term={query_params}'
    response = requests.get(url)
    return extract_first_document(response.text)