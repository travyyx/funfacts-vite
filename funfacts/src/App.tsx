import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Large, H1, H4, P, Lead } from '@/components/ui/Typography'
import Github from '@/assets/github.svg'
import Reddit from '@/assets/reddit.svg'
import Twitter from '@/assets/twitter.svg'
import { useState } from 'react'
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

interface Data {
  text: string | null
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

const de = { language: "de", name: "German" }
const es = { language: "es", name: "Spanish" }
const fr = { language: "fr", name: "French" }

const langs: Language[] = [de, es, fr]

function App() {
  const { toast } = useToast()
  const [data, setData] = useState<Data | null >(null)
  const [loading, setLoading] = useState(false)
  const [languages] = useState<Array<Language>>(langs)
  const [translatable, setTranslatable] = useState(false)

  const fetchFact = async() => {
    try {
      setLoading(true)
      setData({text: ""})
      const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en')
      const data = await response.json() as ResponseData
      setData(data)
      console.log(data.text)
      translateText()
      setLoading(false)

  } catch (error) {
    setData(null)
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
    const data = JSON.stringify({
      q: 'Hello World!',
      source: 'en',
      target: 'es',
    });
    
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
        console.log(languages[0].language)
      }
    });

    xhr.open('POST', 'https://deep-translate1.p.rapidapi.com/language/translate/v2');
    xhr.setRequestHeader('x-rapidapi-key', 'a738856ae8mshddcc391ebb33004p10ebb1jsn5cdd46579cdc');
    xhr.setRequestHeader('x-rapidapi-host', 'deep-translate1.p.rapidapi.com');
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.send(data);

} catch (error) {
  console.error(error)
}
}


  return (
    <main className="bg-background dark w-screen h-screen flex flex-col items-center justify-center gap-3">
      <H1 className="text-primary">Fun Facts Generator.</H1>
      <Toaster />
      { !data ? (
        <Card>
  <CardHeader>
    <CardTitle>Generate Fun Facts in one Click.</CardTitle>
  </CardHeader>
  <CardContent className="w-full flex items-center justify-center">
    <Button className="text-lg" onClick={fetchFact}>Generate.</Button>
  </CardContent>
</Card>
) : (
  <Card className="w-96">
  { !loading ? (
    <>
    <CardHeader>
  <CardTitle className="w-full text-center">Fun Fact</CardTitle>
  </CardHeader>
  <CardContent className="w-full flex items-center justify-center flex-col gap-4">
    <P className="w-full text-center">{data.text}</P>
    <div className="flex w-full items-center justify-center gap-5">
    <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
    <Languages className="hover:text-blue-500 transition-colors duration-200 cursor-pointer" onClick={() => setTranslatable(true)}/>
    </TooltipTrigger>
    <TooltipContent>
      <P className="text-primary">Translate</P>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
    <Button className="text-lg" onClick={() => setData(null)}>Re-Generate.</Button>
    <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
    <Copy className="hover:text-green-500 transition-colors duration-200 cursor-pointer"/>
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
{translatable && (
<div className="w-96">
<Lead className="text-primary mb-2">Language</Lead>
  <div className="flex w-full gap-2 items-center">
  <Select>
    <SelectTrigger className="text-primary">
      <SelectValue placeholder="Select a language." className="text-primary"/>
    </SelectTrigger>
    <SelectContent className="dark">
    { languages && languages.map((language) => {
        return (
          <SelectItem value={language.language} className="dark text-primary">{language.name}</SelectItem>
        )
    })}
    </SelectContent>
  </Select>
  <Button>Translate</Button>
  </div>
</div>
)}
  <H4 className="text-primary mt-5">Useful links</H4>
  <div className="flex items-center gap-12">
    <Button variant="outline" size="icon">
    <a href="https://www.google.com" target="_blank">
    <img src={Github} alt="" />
    </a>
    </Button>
    <Button variant="outline" size="icon">
    <a href="https://www.google.com" target="_blank">
    <img src={Twitter} alt="" />
    </a>
    </Button>
    <Button variant="outline" size="icon">
    <a href="https://www.google.com" target="_blank">
    <img src={Reddit} alt="" />
    </a>
    </Button>
  </div>
    <Large className="w-full text-center text-muted mt-4 italic">Made with love by Ayomide.</Large>
  </main>
  )
}

export default App