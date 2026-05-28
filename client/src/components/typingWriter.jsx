import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export const Typewriter = ({ text, delay = 15, animate = true }) => {
    const [currentText, setCurrentText] = useState(animate ? "" : text);
    const [currentIndex, setCurrentIndex] = useState(animate ? 0 : text.length);

    useEffect(() => {
        if (animate && currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, animate]);

    return (
        <div className="text-sm sm:text-base leading-relaxed">
            <ReactMarkdown 
            rehypePlugins={[rehypeRaw]}
                components={{
                    strong: ({node, ...props}) => <span className="font-bold text-inherit" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />
                }}
            >
                {currentText}
            </ReactMarkdown>
        </div>
    );
};