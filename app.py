from flask import Flask, jsonify, request
from flask_cors import CORS
from langchain_community.llms import CTransformers
from langchain.prompts import PromptTemplate

# Initialize Flask app
app = Flask(__name__) 

# Enable CORS for all routes
CORS(app)

# Initialize the CTransformers model globally
llm = CTransformers(
    model='C:/Users/RAJKIRAN REDDY/Desktop/ps-proj/backend/codellama-7b-instruct.Q4_K_M.gguf',
    model_type='llama',
    config={'max_new_tokens': 500, 'temperature': 0.01}
)

# Define function to get response from CodeLLaMA model
def get_llama_response(input_text, timeComplexity, language):
    try:
        print("CodeLLaMA model loaded successfully.")

        # Define the prompt template
        template = (
            "Generate code for description:\n\n"
            "Description: '{input_text}'\n\n"
            "Time Complexity: {timeComplexity}\n\n"
            "in Programming Language: {language}\n\n"
        )

        # Create the PromptTemplate
        prompt = PromptTemplate(
            input_variables=["input_text", "timeComplexity", "language"],
            template=template
        )

        # Format the prompt
        formatted_prompt = prompt.format(
            input_text=input_text,
            timeComplexity=timeComplexity,
            language=language
        )

        print(f"Formatted Prompt: {formatted_prompt}")

        # Generate the response using the model
        response = llm.invoke(formatted_prompt)
        if not response: 
            raise ValueError("Model returned an empty response");

        # Return the generated response
        return response

    except Exception as e:
        error_message = f"Error interacting with CodeLLaMA model: {str(e)}"
        print(error_message)
        raise e

# Define route to generate code
@app.route('/generate', methods=['POST'])
def generate_response():
    try:
        print("POST request received at /generate")  # Log when POST request is received
        print("Request headers:", request.headers)  # Log headers for debugging
        print("Request data:", request.json)  # Log incoming JSON data

        # Extract data from request
        data = request.json
        input_text = data.get('input_text')
        timeComplexity = data.get('timeComplexity')
        language = data.get('language')

        # Debugging the inputs
        print(f"Input Text: {input_text}, Time Complexity: {timeComplexity}, Language: {language}")

        # Get the response from the CodeLLaMA model
        response = get_llama_response(input_text, timeComplexity, language)

        print("Final response to be sent to client:", response)
        return jsonify({'response': response}), 200

    except Exception as e:
        error_message = f"Error in processing request: {str(e)}"
        print(error_message)  # Log detailed error
        return jsonify({'error': error_message}), 500

# Run the Flask app
if __name__ == '__main__':
    print("Starting Flask server on http://127.0.0.1:5000")
    app.run(debug=True)