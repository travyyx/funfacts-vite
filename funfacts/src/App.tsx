/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import ky from 'ky';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CountUp from 'react-countup';
import { Large, H1, H4, P, Lead } from '@/components/ui/Typography'
import Github from '@/assets/github.svg'
import Reddit from '@/assets/reddit.svg'
import Twitter from '@/assets/twitter.svg'
import { useState, useEffect } from 'react'
import { Copy, Languages } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getDatabase, ref, onValue, update } from "firebase/database";
import { app } from "@/lib/firebase";
interface Data {
  text: string
}

interface ResponseData {
  id: string
  text: string
  source: string
  source_url: string
  language: "en" | "de"
  permalink: string

}

interface Language {
  language: string
  name: string
}

interface Response {
  languages: Array<Language>
}
interface Translated {
  translations: TranslateData
}

interface TranslateResponse {
  data: Translated 
}

interface TranslateData {
  translatedText: string
}


function App() {
  const { toast } = useToast()
  const [data, setData] = useState<Data>({text: ""})
  const [loading, setLoading] = useState(false)
  const [languages, setLanguages] = useState<Array<Language> | null>(null)
  const [translatable, setTranslatable] = useState(false)
  const [selected, setSelected] = useState<string | null>()
  const [translatedData, setTranslatedData] = useState<string | null>(null)
  const [originalData, setOriginalData] = useState("")
  const [count, setCount] = useState(0)

  const fetchFact = async() => {
    try {
      setOriginalData("")
      setSelected(null)
      setTranslatedData(null)
      setLoading(true)
      setTranslatable(false)
      const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en')
      const data = await response.json() as ResponseData
      setData(data)
      setLoading(false)
      increaseCounter()
  } catch (error) {
    setData({text: ""})
    console.log(error)
    toast({
      title: 'Error',
      description: 'Failed to fetch fact',
      variant: 'destructive',
      })
  } finally {
    setLoading(false)
  }
}

const translateText = async() => {

  try {
    setLoading(true)
    
    const json: TranslateResponse = await ky.post('https://deep-translate1.p.rapidapi.com/language/translate/v2', {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': import.meta.env.VITE_TRANSLATE_API_KEY,
        'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
      },
      json:{
        q: data.text,
        source: 'en',
        target: selected,
      },
  }).json();

  setTranslatedData(json.data.translations.translatedText)
  setOriginalData(data.text)

} catch (error) {
  console.log(error)
  toast({
    title: 'Error',
    description: 'Failed to translate fact',
    variant: 'destructive',
    })
  setLoading(false)
} finally {
  setLoading(false)
}
}

const fetchLanguages = async() => {
  const json: Response = await ky.get('https://deep-translate1.p.rapidapi.com/language/translate/v2/languages', {
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_TRANSLATE_API_KEY,
      'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
    },
}).json()

  const langs: Language[] = []
  json.languages.slice(1).forEach((lang: Language) => {
    langs.push(lang)
  })
  await setLanguages(langs)
  }


function backToOriginal() {
  setTranslatedData(null)
  setData({text: originalData})
  setOriginalData("")
}
useEffect(() => {
  fetchLanguages()
  const db = getDatabase(app);
const starCountRef = ref(db, 'facts');
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  setCount(data.count)
});

}, [])
function copyText() {
  try {
    if (translatedData) {
      navigator.clipboard.writeText(translatedData)
      toast({
        title: 'Copied',
        description: 'Fact Copied.',
        })
    } else {
      navigator.clipboard.writeText(data.text)
      toast({
        title: 'Copied',
        description: 'Fact Copied.',
        })
    }
  } catch {
    toast({
      title: 'Error',
      description: 'Failed to copy text',
      variant: 'destructive',
      })
  }
}

function increaseCounter() {
  const db = getDatabase(app);
  update(ref(db, "facts"), {
    count: count + 1
  })

}

function formatNumber(count: number) {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else if (count < 1000000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else {
    return (count / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
}



  return (
    <main className="bg-background dark w-screen h-screen flex flex-col items-center justify-center gap-3">
      <H1 className="text-primary hover:scale-110 hover:text-blue-500 duration-200 transition-all cursor-pointer" onClick={() => {
        setOriginalData("")
        setSelected(null)
        setTranslatedData(null)
        setTranslatable(false)
        setData({text: ""})
        }}>Fun Facts Generator.</H1>
      <Toaster />
      { data.text === "" ? (
        <Card className="animate-in slide-in-from-left-20 duration-700 ease-in-out">
  <CardHeader>
    <CardTitle>Generate Fun Facts in one Click.</CardTitle>
  </CardHeader>
  <CardContent className="w-full flex items-center justify-center">
    <Button className="text-lg" onClick={fetchFact}>Generate.</Button>
  </CardContent>
  <CardFooter className="w-full text-center">
  <CountUp
        end={count}
        duration={2.75}
        formattingFn={(value) => `${formatNumber(value)} Facts generated and counting.`}
        className="w-full text-center text-xl text-muted-foreground"
      />
  </CardFooter>
</Card>
) : (
  <Card className="w-96">
  { !loading ? (
    <>
    <CardHeader>
  <CardTitle className="w-full text-center">Fun Fact</CardTitle>
  </CardHeader>
  <CardContent className="w-full flex items-center justify-center flex-col gap-4">
    { !translatedData ? (
      <P className="w-full text-center">{data.text}</P>
    ) : (
      <P className="w-full text-center">{translatedData}</P>
    )}
    <div className="flex w-full items-center justify-center gap-5">
    <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
    <Languages className="hover:text-blue-500 transition-colors duration-200 cursor-pointer" onClick={() => setTranslatable(!translatable)}/>
    </TooltipTrigger>
    <TooltipContent>
      <P className="text-primary">Translate</P>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
    <Button className="text-lg" onClick={fetchFact}>Re-Generate.</Button>
    <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
    <Copy className="hover:text-green-500 transition-colors duration-200 cursor-pointer" onClick={copyText}/>
    </TooltipTrigger>
    <TooltipContent>
      <P className="text-primary">Copy</P>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
    </div>
  </CardContent>
  </>
  ) : (
    <div className="flex flex-col space-y-3 w-full p-2 h-full justify-center items-center">
      <Skeleton className="w-64 h-8 mb-5"/>
      <Skeleton className="w-72 h-4"/>
      <Skeleton className="w-[16rem] h-4"/>
      <Skeleton className="w-72 h-4"/>
      <Skeleton className="w-[20rem] h-4"/>
      <Skeleton className="w-[12rem] h-4"/>
      <Skeleton className="w-[16rem] h-4 mb-6"/>
      <Skeleton className="w-[10rem] h-8 mt-5"/>
  </div>
  )}
</Card>
)}
{translatable && data && (
<div className="w-96 animate-in slide-in-from-top-10 duration-300 ease-in-out">
<Lead className="text-primary mb-2">Language</Lead>
  <div className="flex w-full gap-2 items-center">
  <Select onValueChange={(value) => setSelected(value)}>
    <SelectTrigger className="text-primary">
      <SelectValue placeholder="Select a language." className="text-primary"/>
    </SelectTrigger>
    <SelectContent className="dark">
    { languages && languages.map((language) => {
        return (
          <SelectItem key={language.language} value={language.language} className="dark text-primary">{language.name}</SelectItem>
        )
    })}
    </SelectContent>
  </Select>
  <Button onClick={translateText} disabled={!selected}>Translate</Button>
  { translatedData && (<Button onClick={backToOriginal}>Original</Button>)}
  </div>
</div>
)}
  <H4 className="text-primary mt-5">Useful links</H4>
  <div className="flex items-center gap-12">
    <Button variant="outline" size="icon">
    <a href="https://github.com/travyyx" target="_blank">
    <img src={Github} alt="" />
    </a>
    </Button>
    <Button variant="outline" size="icon">
    <a href="https://x.com/blob_travis" target="_blank">
    <img src={Twitter} alt="" />
    </a>
    </Button>
    <Button variant="outline" size="icon">
    <a href="https://www.reddit.com/user/YoungTrav1s/" target="_blank">
    <img src={Reddit} alt="" />
    </a>
    </Button>
  </div>
    <Large className="w-full text-center text-primary mt-4">Made with love by Ayomide.</Large>
  </main>
  )
}

export default App
