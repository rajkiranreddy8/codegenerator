# Install required libraries
!pip install langchain-huggingface huggingface_hub transformers accelerate bitsandbytes langchain ipywidgets

# Import required modules
from langchain_huggingface import HuggingFaceEndpoint
from google.colab import widgets, userdata
import os
import ipywidgets as widgets
from IPython.display import display

# Get Hugging Face secret API key from Google Colab environment
sec_key = userdata.get("HUGGINGFACEHUB_API_TOKEN")
print("Hugging Face API Key:", sec_key)

# Set environment variable for Hugging Face API key
os.environ["HUGGINGFACEHUB_API_TOKEN"] = sec_key

# Set the repository ID (you can adjust this depending on the model you want to use)
repo_id = "mistralai/Mistral-7B-Instruct-v0.3"

# Initialize the model
llm = HuggingFaceEndpoint(repo_id=repo_id, max_length=128, temperature=0.7, token=sec_key)

# Function to handle user input and get response from the model
def generate_code(prompt):
    # Call the model to generate code based on the user input
    response = llm.invoke(prompt)
    return response

# Set up a simple UI for user input in Google Colab
def display_frontend():
    # Create a text box widget for user input
    text_input = widgets.Text(
        value='',
        placeholder='Enter your prompt here...',
        description='Prompt:',
        disabled=False
    )

    # Create an output widget to display the model response
    output = widgets.Output()

    # Function to handle the button click event
    def on_button_click(b):
        with output:
            output.clear_output()  # Clear previous output
            prompt = text_input.value
            if prompt:
                # Call the function to get code from the model
                code_response = generate_code(prompt)
                print("Generated Code for Prompt:\n", code_response)
            else:
                print("Please enter a valid prompt!")

    # Create a button widget
    button = widgets.Button(description="Generate Code")

    # Set the button click event to call the function
    button.on_click(on_button_click)

    # Display the widgets in the Google Colab notebook
    display(text_input, button, output)

# Display the frontend in the notebook
display_frontend()
