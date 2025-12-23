
import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

export const enhanceProfessionalSummary = async (req,res) => {
    try {
        const {userContent} = req.body;
        if(!userContent){
            return res.status(400).json({message:"Missing required fields"})
        }
       const response =  await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
          messages: [
        { role: "system", content: "You are an expert in resume writing.Your task is to enchance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experince and carrer objectives. Make it compeliing and ATS-friendly. and only reutrn text no options or anything else. " },
        {
            role: "user",
            content: userContent,
        },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
         return res.status(400).json({message:error.message})
    }
}


export const enhanceJobDescription = async (req,res) => {
    try {
        const {userContent} = req.body;
        if(!userContent){
            return res.status(400).json({message:"Missing required fields"})
        }
       const response =  await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
          messages: [
        { role: "system", content: "You are an expert in resume writing.Your task is to enchance the job description of a resume. The  job description should be 1-2 sentences also highlighting key responsibilities and achivements. Use action vers and quantifiable results where possible Make it ATS-friendly. and only reutrn text no options or anything else. " },
        {
            role: "user",
            content: userContent,
        },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
         return res.status(400).json({message:error.message})
    }
}



export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt = "You are an expert AI Agent to extract data from resume.";
    const userPrompt = `extract data from this resume: ${resumeText}
Provide data in the following JSON format with no additional text before and after:
{
  professional_summary : {type:String, default: ""},
  skills : [{type:String}],
  personal_info :{
    image:{type:String, default: ""},
    full_name:{type:String, default: ""},
    profession:{type:String, default: ""},
    email:{type:String, default: ""},
    phone:{type:String, default: ""},
    linkedin:{type:String, default: ""},
    website:{type:String, default: ""}
  },
  experience: [],
  project: [],
  education: []
}`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const extractedData = response.choices[0].message.content;

    // ✅ CLEAN MARKDOWN (ONLY FIX)
    const cleanedData = extractedData
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanedData);

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    return res.json({ resumeId: newResume._id });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
