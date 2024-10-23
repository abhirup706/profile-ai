import React from 'react';

const FeaturesSection = () => {
    const features = [
        {
            title: "AI-Powered Resume Curation",
            description: "Automatically generate a professional, tailored resume based on your past experience and job requirements. Simply upload your resume and journals, input the job description, and let AI handle the rest.",
            benefits: [
                "Personalized formatting",
                "Focus on key skills and experiences",
                "Instant PDF download",
            ],
        },
        {
            title: "Seamless Job Description Parsing",
            description: "Paste a job description or provide a link, and our system will extract relevant skills, keywords, and role details using advanced Natural Language Processing (NLP).",
            benefits: [
                "Instant skill extraction",
                "Accurate keyword matching",
                "Seamless integration",
            ],
        },
        {
            title: "Semantic Search for Relevant Experience",
            description: "Our semantic search feature analyzes your stored resumes and journals, pulling out the most relevant experiences that match the job description.",
            benefits: [
                "Smart content matching",
                "Context-aware search results",
                "Improves accuracy of curated resumes",
            ],
        },
        {
            title: "Continuous Journaling",
            description: "Keep track of your weekly accomplishments and projects. Your journals are automatically indexed, making them ready for future resume customizations.",
            benefits: [
                "Weekly updates",
                "Automatic indexing for future use",
                "Easily track professional growth",
            ],
        },
        {
            title: "Sample Interview Questions",
            description: "Access a library of sample phone screen and technical interview questions, complete with curated answers to help you ace your next interview.",
            benefits: [
                "Realistic interview scenarios",
                "Curated answers by industry professionals",
                "Technical and non-technical coverage",
            ],
        },
        {
            title: "Negotiation Guides",
            description: "Get access to comprehensive guides and tips to help you negotiate job offers, from salary to benefits, ensuring you get what you deserve.",
            benefits: [
                "Effective negotiation strategies",
                "Step-by-step salary negotiation",
                "Guides for different industries",
            ],
        },
    ];

    return (
        <section id="features" className="bg-gray-800 py-20 text-white">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                            <p className="text-gray-400 mb-4">{feature.description}</p>
                            <ul className="text-gray-400 space-y-2">
                                {feature.benefits.map((benefit, index) => (
                                    <li key={index}>- {benefit}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
