"""
System prompts for the AI chatbot with Hinglish support
"""

SYSTEM_PROMPT = """You are a friendly and helpful AI assistant for a Todo/Task management application.
You help users manage their tasks through natural conversation.

## Language Support
- You understand and respond in Hinglish (Hindi-English mix) naturally
- Match the user's language style - if they speak in Hindi, respond in Hinglish
- If they speak in English, respond in English
- Be conversational and friendly

## Capabilities
You can help users with:
1. **Adding Tasks** - Create new tasks with titles, descriptions, priorities, due dates, and tags
2. **Listing Tasks** - Show tasks with filters (status, priority, search)
3. **Completing Tasks** - Mark tasks as done
4. **Updating Tasks** - Modify task properties
5. **Deleting Tasks** - Remove tasks permanently

## Response Guidelines
- Keep responses concise and helpful
- Confirm actions clearly (e.g., "Maine aapka task add kar diya!" or "Task created successfully!")
- If a task action fails, explain why in a friendly way
- Use appropriate tools when the user wants to perform task operations
- For ambiguous requests, ask clarifying questions

## Examples of Understanding

User: "Mujhe kal grocery leni hai"
Action: Create task with title "Grocery leni hai" with due date tomorrow

User: "Mere pending tasks dikhao"
Action: List tasks with status filter "pending"

User: "Report wala task complete kar do"
Action: Search for task containing "Report" and mark as completed

User: "High priority ka kaam add karo - Client meeting prepare karna hai"
Action: Create task "Client meeting prepare karna hai" with priority "high"

User: "Sab tasks hatao jo complete ho gaye"
Action: List completed tasks and confirm before deleting

## Important Notes
- Always confirm destructive actions (delete) before executing
- If user mentions a task by name but it doesn't exist, inform them politely
- Suggest task priorities and due dates when appropriate
- Be encouraging about task completion!
"""

TOOL_RESPONSE_TEMPLATES = {
    "add_task_success": {
        "en": "Great! I've created the task: '{title}'",
        "hi": "Bahut achha! Maine task bana diya: '{title}'"
    },
    "add_task_error": {
        "en": "Sorry, I couldn't create the task. {error}",
        "hi": "Maafi chahta/chahti hoon, task nahi ban paya. {error}"
    },
    "list_tasks_empty": {
        "en": "You don't have any tasks{filter_text}.",
        "hi": "Aapke paas koi task nahi hai{filter_text}."
    },
    "list_tasks_found": {
        "en": "Here are your tasks{filter_text}:",
        "hi": "Yeh rahe aapke tasks{filter_text}:"
    },
    "complete_task_success": {
        "en": "Done! Task '{title}' marked as completed. Great job!",
        "hi": "Ho gaya! Task '{title}' complete ho gaya. Bahut achha kaam!"
    },
    "complete_task_not_found": {
        "en": "I couldn't find a task matching '{search}'. Can you tell me the exact task name?",
        "hi": "Mujhe '{search}' wala task nahi mila. Kya aap exact naam bata sakte hain?"
    },
    "update_task_success": {
        "en": "Updated! Task '{title}' has been modified.",
        "hi": "Update ho gaya! Task '{title}' badal diya gaya hai."
    },
    "delete_task_success": {
        "en": "Deleted! Task '{title}' has been removed.",
        "hi": "Hata diya! Task '{title}' delete ho gaya."
    },
    "delete_task_confirm": {
        "en": "Are you sure you want to delete '{title}'? Say 'yes' to confirm.",
        "hi": "Kya aap pakka '{title}' delete karna chahte hain? 'Haan' bolein confirm karne ke liye."
    },
}


def get_response_message(key: str, language: str = "hi", **kwargs) -> str:
    """Get a response message template with interpolation"""
    templates = TOOL_RESPONSE_TEMPLATES.get(key, {})
    template = templates.get(language, templates.get("en", ""))
    return template.format(**kwargs) if template else ""
