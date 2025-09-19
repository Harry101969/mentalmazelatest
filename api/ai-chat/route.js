import { withAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Mock AI responses for demonstration
// In production, integrate with Google Gemini API
const generateAIResponse = (message, userContext) => {
  const lowerMessage = message.toLowerCase();
  
  // Anxiety-related responses
  if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
    return {
      response: `I understand you're feeling anxious, and that's completely valid. Anxiety is our mind's way of trying to protect us, even when we don't need that protection right now.

Here are some gentle techniques that might help:
• Try the 4-4-4-4 breathing technique (like in Level 2)
• Ground yourself by naming 5 things you can see, 4 you can hear, 3 you can touch
• Remember: this feeling is temporary and will pass

What specifically is making you feel anxious right now? Sometimes talking about it can help reduce its power over us. 💙`,
      suggestions: [
        "Let's do a breathing exercise together",
        "Help me practice grounding techniques",
        "I want to journal about my anxiety"
      ]
    };
  }

  // Breathing/relaxation requests
  if (lowerMessage.includes('breathing') || lowerMessage.includes('breathe') || lowerMessage.includes('relax')) {
    return {
      response: `Absolutely! Breathing exercises are one of the most powerful tools we have for managing stress and anxiety. Let's practice together.

Try this simple technique:
1. Breathe in slowly for 4 counts
2. Hold for 4 counts  
3. Breathe out slowly for 4 counts
4. Pause for 4 counts
5. Repeat 4-6 times

Focus on making your exhale longer than your inhale - this activates your body's relaxation response. You can also try Level 2 of the game for a guided breathing experience!

How are you feeling right now? Would you like to try this together? 🌬️`,
      suggestions: [
        "Guide me through more breathing exercises",
        "Take me to Level 2 breathing game",
        "I want to learn about other relaxation techniques"
      ]
    };
  }

  // Motivation/encouragement requests
  if (lowerMessage.includes('motivation') || lowerMessage.includes('encourage') || lowerMessage.includes('support')) {
    return {
      response: `I'm so glad you reached out! That takes courage, and I want you to know that you're not alone in this journey. 🌟

Here's what I want you to remember:
• You are stronger than you think
• Every small step forward matters
• It's okay to have difficult days - they don't define you
• You've overcome challenges before, and you can do it again
• Your mental health journey is unique and valid

You're here, you're trying, and that's something to be proud of. What's one small thing you can do today to take care of yourself?`,
      suggestions: [
        "Help me set a small goal for today",
        "I want to practice self-care",
        "Tell me about my progress so far"
      ]
    };
  }

  // Mindfulness/meditation
  if (lowerMessage.includes('mindful') || lowerMessage.includes('meditation') || lowerMessage.includes('present')) {
    return {
      response: `Mindfulness is such a beautiful practice! It's about being present with whatever you're experiencing right now, without judgment.

Here's a simple mindfulness exercise:
• Take three deep breaths
• Notice what you can see around you right now
• Feel your feet on the ground
• Listen to the sounds in your environment
• Accept whatever thoughts or feelings arise

Remember, mindfulness isn't about emptying your mind - it's about observing your thoughts and feelings with kindness and curiosity.

Level 4 (Mindful Garden) has some wonderful mindfulness exercises when you're ready! What would you like to be more mindful of in your daily life? 🧘‍♀️`,
      suggestions: [
        "Teach me more mindfulness techniques",
        "I want to try a body scan meditation",
        "Help me be more present in daily activities"
      ]
    };
  }

  // Journaling help
  if (lowerMessage.includes('journal') || lowerMessage.includes('write') || lowerMessage.includes('thoughts')) {
    return {
      response: `Journaling is such a powerful tool for processing emotions and gaining clarity! Sometimes the hardest part is just getting started.

Here are some gentle prompts to help you begin:
• How am I feeling right now, and what might be causing these feelings?
• What am I grateful for today, even if it's something small?
• What would I tell a good friend who was going through what I'm experiencing?
• What do I need right now to feel more at peace?

Remember, there's no "right" way to journal. You can write stream-of-consciousness, make lists, or even draw. The goal is just to get your thoughts and feelings out of your head and onto paper.

What's been on your mind lately that you'd like to explore through writing? ✍️`,
      suggestions: [
        "Give me more journaling prompts",
        "Help me process a difficult emotion",
        "I want to start a gratitude practice"
      ]
    };
  }

  // Stress management
  if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
    return {
      response: `Feeling stressed or overwhelmed is so common, especially in today's world. Your feelings are completely valid, and there are gentle ways to help manage these intense emotions.

Here are some strategies that might help:
• Break big tasks into smaller, manageable steps
• Practice the "one thing at a time" approach
• Use the 5-4-3-2-1 grounding technique
• Take regular breaks, even if just for a few minutes
• Remember that it's okay to say no to additional commitments

Sometimes stress is our body's way of telling us we need to slow down and take care of ourselves. What's contributing most to your stress right now? Let's see if we can break it down together. 🤗`,
      suggestions: [
        "Help me prioritize my tasks",
        "Teach me stress management techniques",
        "I need help setting boundaries"
      ]
    };
  }

  // Default supportive response
  return {
    response: `Thank you for sharing with me. I'm here to listen and support you in whatever way I can. 💙

It sounds like you have something on your mind. Sometimes just talking about what we're experiencing can help us process it better. I'm a safe space where you can express yourself without judgment.

Whether you're dealing with difficult emotions, need encouragement, or want to learn new coping strategies, I'm here for you. Your mental health journey is important, and every step you take toward wellness matters.

What would be most helpful for you right now? I can help with breathing exercises, mindfulness techniques, journaling prompts, or just listen to whatever you'd like to share.`,
    suggestions: [
      "I'm feeling anxious",
      "Help me with breathing exercises",
      "I need some encouragement",
      "Teach me about mindfulness"
    ]
  };
};

async function handler(request) {
  try {
    await dbConnect();
    const userId = request.user.userId;
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return Response.json(
        { message: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user context for personalized responses
    const user = await User.findById(userId).select('name gameProgress moodTracker');
    
    // Generate AI response (in production, use Google Gemini API)
    const aiResponse = generateAIResponse(message, {
      userName: user.name,
      gameProgress: user.gameProgress,
      recentMoods: user.moodTracker?.slice(-3) || []
    });

    // Log the conversation for analytics (optional)
    // You could store chat history in the database here

    return Response.json(aiResponse);
  } catch (error) {
    console.error('AI chat error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);