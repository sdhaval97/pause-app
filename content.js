// Content for reading materials and meditation exercises
const readingMaterials = [
    {
        title: "The Power of Small Wins",
        content: `Every time you resist a craving, you're building a stronger version of yourself. Think of it like exercising a muscle - each 'no' makes the next one easier.

Research shows that habits are formed in a loop: cue → craving → response → reward. Right now, you've identified the cue and craving. By choosing this 5-minute break instead of the usual response, you're rewiring your brain.

The craving you're feeling will peak and then naturally decline. Most cravings last only 3-5 minutes if you don't feed them. You're already halfway through just by being here.

Consider this: what would the person you want to become do right now? That person is already inside you - you're just practicing being them.

Take a moment to appreciate that you chose to break the pattern. That choice, right now, is changing your future self.`
    },
    {
        title: "The Science of Cravings",
        content: `Your brain is designed to seek pleasure and avoid pain. When you have a craving, your brain is essentially screaming "Do the thing that felt good before!" But here's what's fascinating - you can observe this process without being controlled by it.

Neuroscientists have found that the prefrontal cortex (your rational brain) can override the limbic system (your emotional brain) when you give it time and space. That's exactly what you're doing right now.

The urge you're feeling is just electrical signals and chemical reactions. It's not actually you - it's your brain's autopilot trying to run an old program. You are the programmer, and you're writing new code.

Studies show that people who practice mindful awareness of their cravings are 60% more likely to break unwanted habits. You're not just fighting the habit - you're studying it, understanding it, and ultimately transcending it.

Remember: You are not your thoughts. You are not your cravings. You are the observer of both.`
    },
    {
        title: "The Compound Effect",
        content: `Right now, you might think this one moment doesn't matter much. But you're wrong - this moment is everything.

Every habit is the result of hundreds of small decisions, compounded over time. Every cigarette not smoked, every unhealthy snack not eaten, every hour not wasted - these add up to create the life you're living.

The beautiful thing about compound effects is that they work in both directions. Bad habits compound into problems, but good habits compound into success. You're currently in the process of switching from one trajectory to another.

Think about where you'll be in 90 days if you keep making this choice. What about a year? The person you'll become will thank you for this exact moment of resistance.

This isn't about perfection - it's about direction. Each time you choose differently, you're voting for the type of person you want to become. You're literally reshaping your identity one decision at a time.

The craving will pass. The pride in your choice will last.`
    },
    {
        title: "Understanding Triggers",
        content: `Every habit has a trigger - something that sets off the craving. It might be stress, boredom, a specific time of day, or even a particular location. Right now, you've successfully identified your trigger and interrupted the pattern.

This is huge. Most people go through life unconsciously responding to triggers. You're becoming conscious of the process, which means you're gaining control over it.

The next time you feel this same trigger, you'll have this experience to reference. You'll know that you can pause, that you can choose differently, that the craving will pass.

Researchers call this "surfing the urge" - riding the wave of the craving without being wiped out by it. You're learning to be a surfer, not a victim of the waves.

Each time you practice this pause, you're literally rewiring your brain. The neural pathways that used to automatically lead to the bad habit are weakening, while new pathways of conscious choice are strengthening.

You're not just breaking a habit - you're building a superpower: the ability to choose your response to any situation.`
    },
    {
        title: "The Identity Shift",
        content: `The most powerful way to change is not to focus on what you want to achieve, but on who you want to become. Right now, you're not just avoiding a bad habit - you're becoming the type of person who makes conscious choices.

Every action you take is a vote for the type of person you wish to become. This choice you're making right now? That's a vote for someone who has control over their impulses, someone who prioritizes their long-term wellbeing over short-term gratification.

Think about your identity in relation to this habit. Instead of saying "I'm trying to quit," start saying "I'm not the type of person who does that." This subtle shift changes everything.

When you see yourself as someone who doesn't engage in the bad habit, the behavior becomes easier to maintain. You're not depriving yourself - you're simply acting in alignment with who you are.

The craving you're experiencing right now is your old identity trying to reassert itself. But you're choosing to strengthen your new identity instead. With each choice like this, the new identity becomes more real, more automatic, more truly you.

You're not just changing what you do - you're changing who you are.`
    }
];

const meditations = [
    {
        title: "5-Minute Breathing Reset",
        content: `<div class="meditation-instruction">
            <strong>Minute 1:</strong> Sit comfortably and close your eyes. Take 5 deep breaths, counting each exhale: 1... 2... 3... 4... 5. Notice how your body feels right now.
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 2:</strong> Place one hand on your chest, one on your belly. Breathe so that only your belly hand moves. In for 4 counts, hold for 4, out for 6. This activates your calm response.
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 3:</strong> Notice the craving in your body. Where do you feel it? Don't fight it - just observe it with curiosity. Say to yourself: "I notice I'm having a craving. That's okay."
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 4:</strong> Imagine the craving as a wave. Waves rise and fall naturally. You don't have to do anything - just be the beach, letting the wave wash over you and retreat.
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 5:</strong> Take 5 more deep breaths. With each exhale, release the tension. When you're ready, open your eyes and notice how you feel now compared to 5 minutes ago.
        </div>`
    },
    {
        title: "Body Scan for Cravings",
        content: `<div class="meditation-instruction">
            <strong>Minute 1:</strong> Sit or lie down comfortably. Close your eyes and take three deep breaths. Starting from the top of your head, slowly scan down through your body.
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 2:</strong> Notice your face, jaw, neck, and shoulders. Are you holding tension anywhere? Consciously relax these areas. The craving often creates physical tension.
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 3:</strong> Continue to your arms, chest, and stomach. Where do you feel the craving most strongly? Instead of resisting, breathe into that area and soften around it.
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 4:</strong> Move to your lower back, hips, and legs. Notice how the craving might be affecting your entire body. Send breath and relaxation to each area.
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 5:</strong> Take a final scan from head to toe. Notice how your body feels now. The craving may still be there, but you've changed your relationship to it. You are not the craving - you are the awareness observing it.
        </div>`
    },
    {
        title: "The RAIN Technique",
        content: `<div class="meditation-instruction">
            <strong>R - Recognize (Minute 1):</strong> What exactly are you experiencing right now? Name it: "I'm having a craving for..." Don't judge it, just recognize it clearly.
        </div>
        
        <div class="meditation-instruction">
            <strong>A - Allow (Minute 2):</strong> Instead of fighting the craving, allow it to be here. Say: "It's okay that I'm having this craving. This is what humans experience." Breathe with acceptance.
        </div>
        
        <div class="meditation-instruction">
            <strong>I - Investigate (Minute 3):</strong> Get curious about the craving. How does it feel in your body? What thoughts come with it? What emotions? Explore it like a scientist, not a judge.
        </div>
        
        <div class="meditation-instruction">
            <strong>N - Nurture (Minutes 4-5):</strong> Place your hand on your heart. Speak to yourself like you would a good friend: "This is difficult, but I can handle it. I'm learning to be free. I'm proud of myself for pausing."
        </div>
        
        Remember: You're not trying to eliminate the craving - you're learning to be with it without being controlled by it.`
    },
    {
        title: "Loving-Kindness for Self-Compassion",
        content: `<div class="meditation-instruction">
            <strong>Minute 1:</strong> Close your eyes and place both hands on your heart. Take three deep breaths and say to yourself: "May I be kind to myself in this moment."
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 2:</strong> Notice any self-criticism or judgment about having this craving. Gently say: "May I forgive myself for being human. May I treat myself with the same kindness I'd show a good friend."
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 3:</strong> Breathe in self-compassion, breathe out self-judgment. Repeat: "May I be patient with myself as I learn and grow. May I celebrate small victories."
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 4:</strong> Think of someone you love who has struggled with habits. Send them love: "May you be free from suffering. May you find peace." Notice how this feels in your body.
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 5:</strong> Return that same love to yourself: "May I be free from this habit. May I find peace. May I be happy." Rest in this feeling of self-compassion.
        </div>`
    },
    {
        title: "Visualization: Future Self",
        content: `<div class="meditation-instruction">
            <strong>Minute 1:</strong> Close your eyes and take five deep breaths. Imagine yourself one year from now, completely free from this habit. What do you look like? How do you feel?
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 2:</strong> See your future self going through a typical day. Notice the confidence, the peace, the freedom. Watch how they handle situations that used to trigger the old habit.
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 3:</strong> Your future self approaches you now. What do they want to tell you? What advice do they have? What do they want you to know about the journey ahead?
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 4:</strong> Your future self places their hand on your shoulder and says: "This moment right now - choosing to pause instead of react - this is exactly how I became free. You're already becoming me."
        </div>
        
        <div class="meditation-instruction">
            <strong>Minute 5:</strong> Feel the connection between who you are now and who you're becoming. Take three deep breaths and slowly open your eyes, carrying this vision with you.
        </div>`
    }
];

// Export for use in other files (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { readingMaterials, meditations };
}