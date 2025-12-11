// "use client";
// import React from 'react'
// import { Badge } from '../ui/badge';
// import { Button } from '../ui/button';
// interface DescriptionProps {
//     problem: { 
//       id: string; 
//       title: string; 
//       description: string; 
//       difficulty: string; 
//       testCases: { id: string; input: string; output: string; problemId: string|null; createdAt: Date; updatedAt: Date; }[]; 
//     } | null | undefined; 
// }
// const Description = ({problem}:DescriptionProps) => {
//   const data = problem?.description.split('<br />')
//   return (
//     <div className='px-5 py-6'>
//       <div className=' flex  items-center'>
//         <h1 className='text-xl font-bold p-5 px-3'>{problem?.title}</h1>
//         <h2><Badge variant="outline" className={`${problem?.difficulty==="Easy"?"bg-green-300":problem?.difficulty==="Medium"?"bg-yellow-300":problem?.difficulty==="Hard"?"bg-red-300":"white"} text-black`} >{problem?.difficulty}</Badge>
//         </h2>
//       </div>
//       <div className='px-7 '>
//         <div>
//           {data?.map((item, index) => {
//             return <p className={`${item.startsWith("Exam")?"text-xl font-semibold py-4":""}   ${item.startsWith("Input:-")||item.startsWith("output:-")?"px-2 py-1 font-medium":""} ${index==0?"text-lg":""}`} key={index}>{item}</p>
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Description

"use client";
import React from 'react';
import { Badge } from '../ui/badge';

// Utility to extract text and apply bold styling where needed
const parseDescription = (html: string): (string | { type: 'bold'; text: string })[] => {
  const result: (string | { type: 'bold'; text: string })[] = [];

  // Regex to match <strong>...</strong> or <b>...</b>
  const strongTagRegex = /<strong>(.*?)<\/strong>/g;
  let lastIndex = 0;
  let match;

  while ((match = strongTagRegex.exec(html)) !== null) {
    const [fullMatch, boldText] = match;
    const matchIndex = match.index;

    // Push text before the bold tag
    if (matchIndex > lastIndex) {
      result.push(html.substring(lastIndex, matchIndex).replace(/<[^>]+>/g, '').trim());
    }

    // Push the bold part
    result.push({ type: 'bold', text: boldText.trim() });

    lastIndex = matchIndex + fullMatch.length;
  }

  // Push any remaining text
  if (lastIndex < html.length) {
    result.push(html.substring(lastIndex).replace(/<[^>]+>/g, '').trim());
  }

  return result.filter(Boolean);
};

interface DescriptionProps {
  problem: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    testCases: {
      id: string;
      input: string;
      output: string;
      problemId: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[];
  } | null | undefined;
}

const Description = ({ problem }: DescriptionProps) => {
  const parsedLines = problem?.description
    ?.split(/<br\s*\/?>/i)
    .flatMap(line => parseDescription(line))
    .filter(Boolean);

  return (
    <div className='px-5 py-6'>
      <div className='flex items-center justify-between pr-4'>
        <div>
          <h1 className='text-2xl font-bold px-3 text-slate-900'>{problem?.title}</h1>
          <p className='px-3 text-sm text-slate-600'>Work through the description and solve using the editor.</p>
        </div>
        <h2>
          <Badge
            variant="outline"
            className={`${
              problem?.difficulty === 'Easy'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : problem?.difficulty === 'Medium'
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : problem?.difficulty === 'Hard'
                ? 'bg-rose-100 text-rose-800 border-rose-200'
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            {problem?.difficulty}
          </Badge>
        </h2>
      </div>

      <div className='px-7 space-y-2'>
        {parsedLines?.map((item, index) => {
          if (typeof item === 'string') {
            return (
              <p className='text-base leading-relaxed text-slate-800' key={index}>
                {item}
              </p>
            );
          } else if (item.type === 'bold') {
            return (
              <p className='text-base font-bold leading-relaxed text-slate-900' key={index}>
                {item.text}
              </p>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Description;

