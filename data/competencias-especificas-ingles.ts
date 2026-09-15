/**
 * Catálogo de Competencias Específicas — Currículo Integrado
 * Fuente: MESOCURRICULUM / "6. Inglés.xlsx" (Matriz de distribución/desagregación
 * de saberes e indicadores de evaluación).
 *
 * Codificación oficial:
 *   - Competencia específica: CE.<ÁREA>.<subnivel>.<secuencial>
 *   - Saberes: <ÁREA>.<subnivel>.<bloque>.<d|p|a>.<n>
 *   - Indicadores de evaluación: I.<ÁREA>.<subnivel>.<secuencial>.<n>
 *
 * Extraído directamente de la matriz oficial (no texto parafraseado) para
 * evitar códigos inventados o desalineados con el catálogo del MINEDUC.
 */

import type { CompetenciaEspecificaCompleta } from "./types-competencias-especificas";

export const COMPETENCIAS_INGLES: CompetenciaEspecificaCompleta[] = [
  {
    codigo: "CE.EFL.2.1",
    descripcion: "Expression of curiosity about the place we live in through simple questions and answers, to identify where we are and where we live, and to recognize shared spaces with others, understanding place as a space of belonging and mutual care",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.EFL.2.1.1", texto: "Answers simple questions about where they are and where they live, using familiar vocabulary with support from images and gestures" },
          { codigo: "I.EFL.2.1.2", texto: "Names familiar places such as the classroom, school, and home using simple words" },
          { codigo: "I.EFL.2.1.3", texto: "Shows curiosity about the names of familiar places in English" },
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.1. English as a language learned alongside the languages used at home.",
            "EFL.2.2.d.2. English as a shared language used to communicate with people from different places.",
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, and home.",
            "EFL.2.2.d.16. Simple affirmative sentences using I am and This is.",
            "EFL.2.2.d.17. Simple questions with what and where.",
          ],
          procedimentales: [
            "EFL.2.1.p.1. Recognizes greetings, introductions, and short instructions.",
            "EFL.2.2.p.6. Names familiar people, objects, and places in the immediate environment.",
            "EFL.2.2.p.13. Answers simple questions about identity and place.",
            "EFL.2.3.p.32. Predicts the meaning of short illustrated texts using images and familiar words.",
          ],
          actitudinales: [
            "EFL.2.1.a.1. Shows curiosity about words and expressions in English.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.EFL.2.1.1", texto: "Asks and answers simple questions about where they are and where they live, using familiar vocabulary with support from images and gestures" },
          { codigo: "I.EFL.2.1.2", texto: "Names nearby places such as the classroom, school, home, and neighborhood using simple words or phrases" },
          { codigo: "I.EFL.2.1.3", texto: "Shows curiosity about the names of places in their environment and can name some of them in both languages" },
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.1. English as a language learned and shared alongside the languages used at home and in the local community. English as a shared language used to communicate with people from different places and cultures.",
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, home, and neighbourhood.",
            "EFL.2.2.d.16. Simple affirmative sentences using I am, you are, this is.",
            "EFL.2.2.d.17. Simple questions with what, where, and who.",
          ],
          procedimentales: [
            "EFL.2.1.p.1. Listens to greetings, introductions, short instructions, and simple questions. Names places, people, objects, and living beings in the surrounding environment.",
            "EFL.2.2.p.13. Asks and answers about identity and place.",
            "EFL.2.3.p.32. Predicts the meaning of short illustrated texts using images, titles, and familiar words.",
          ],
          actitudinales: [
            "EFL.2.1.a.1. Shows curiosity about how things are said in English and the language(s) used at home.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.EFL.2.1.1", texto: "Asks and answers simple questions about where they are, their environment, and where they live, using expressions such as Where are you? / I am at school / I live in…, with support from images, gestures, and familiar vocabulary" },
          { codigo: "I.EFL.2.1.2", texto: "Names nearby places using simple words or phrases — classroom, school, home, neighborhood, and community — as part of their everyday environment" },
          { codigo: "I.EFL.2.1.3", texto: "Shows curiosity about the names of places in their environment and can name them in both languages" },
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.2. English as a shared language used to communicate with people from different places, cultures, and communities.",
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, home, neighbourhood, and community.",
            "EFL.2.2.d.16. Simple affirmative sentences using I am, you are, this is.",
            "EFL.2.2.d.17. Simple questions with what, where, who, how, and how many.",
          ],
          procedimentales: [
            "EFL.2.3.p.32. Predicts the meaning of short illustrated texts using images, titles, and familiar words.",
          ],
          actitudinales: [
            "EFL.2.1.a.1. Shows curiosity about how things are said in English and other languages.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.2",
    descripcion: "Expression of mutual care through greetings and introductions, using simple exchanges of name, age, and place of residence, to build recognition among classmates and sustain respectful interaction, respecting each person's pace of communication",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.EFL.2.2.1", texto: "Greets, says goodbye, and thanks using simple expressions such as hello, goodbye, and thank you in brief classroom interactions" },
          { codigo: "I.EFL.2.2.2", texto: "Gives basic personal information, including name and age, while taking turns in simple classroom interactions" },
          { codigo: "I.EFL.2.2.3", texto: "Participates in simple English greetings and introductions with confidence, even when using developing pronunciation and vocabulary" },
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.8. Words and expressions about family and close people.",
            "EFL.2.2.d.15. Simple expressions for greeting, saying goodbye, and thanking.",
            "EFL.2.2.d.16. Simple affirmative sentences using I am and This is.",
            "EFL.2.2.d.17. Simple questions with what and where.",
            "EFL.2.2.d.27. Short oral texts used in everyday classroom interactions: greetings, songs, rhymes, and simple instructions. (Ref. EFL.1.d.22.) Basic practices for participating in conversations: taking turns, listening attentively, and looking at the speaker.",
          ],
          procedimentales: [
            "EFL.2.1.p.1. Recognizes greetings, introductions, and short instructions.",
            "EFL.2.2.p.5. Says one's own name with simple words or phrases.",
            "EFL.2.2.p.12. Greets and takes leave in short exchanges.",
            "EFL.2.2.p.13. Answers simple questions about identity and place.",
          ],
          actitudinales: [
            "EFL.2.2.a.3. Shows willingness to use simple English words and expressions.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.EFL.2.2.1", texto: "Greets, says goodbye, thanks, and apologizes using simple expressions such as hello, goodbye, thank you, and sorry in brief classroom interactions" },
          { codigo: "I.EFL.2.2.2", texto: "Gives and asks for basic personal information, including name, age, and where they live, while taking turns and respecting classmates' participation" },
          { codigo: "I.EFL.2.2.3", texto: "Participates in simple English introductions and classroom interactions with confidence, even when using developing pronunciation and vocabulary" },
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.8. Words and expressions about family, close people, and relationships of care.",
            "EFL.2.2.d.15. Simple expressions for greeting, saying goodbye, thanking, and interacting in familiar everyday situations.",
            "EFL.2.2.d.16. Simple affirmative sentences using I am, you are, this is.",
            "EFL.2.2.d.17. Simple questions with what, where, and who.",
            "EFL.2.1.d.22. Short oral texts used in everyday classroom interactions: greetings, introductions, songs, rhymes, riddles, instructions, and simple descriptions.",
            "EFL.2.2.d.27. Basic practices for participating in conversations: taking turns, listening attentively, looking at the speaker, and repeating when needed.",
          ],
          procedimentales: [
            "EFL.2.1.p.1. Listens to greetings, introductions, short instructions, and simple questions. Says one's own name and age with simple phrases. (Ref. EFL.2.p.5.) EFL.2.p.6. Names places, people, objects, and living beings in the surrounding environment. Greets, takes leave, and thanks in short exchanges. (Ref. EFL.2.p.12.) Asks and answers about identity and place.",
          ],
          actitudinales: [
            "EFL.2.2.a.3. Shows willingness to participate in simple interactions in English.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.EFL.2.2.1", texto: "Greets, says goodbye, thanks, and apologizes using simple expressions such as hello, goodbye, thank you, and sorry in brief classroom interactions" },
          { codigo: "I.EFL.2.2.2", texto: "Gives and asks for basic personal information, including name, age, and where they live, while taking turns and respecting classmates' participation and learning pace" },
          { codigo: "I.EFL.2.2.3", texto: "Participates in simple English introductions and classroom interactions with confidence, even when using developing pronunciation and vocabulary" },
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.8. Words and expressions about family, close people, and relationships of care.",
            "EFL.2.2.d.15. Simple expressions for greeting, saying goodbye, thanking, and interacting in everyday situations.",
            "EFL.2.2.d.16. Simple affirmative sentences using I am, you are, this is.",
            "EFL.2.2.d.17. Simple questions with what, where, who, how, and how many.",
            "EFL.2.1.d.22. Short oral texts used in everyday classroom and community interactions: greetings, introductions, songs, rhymes, riddles, instructions, and simple descriptions.",
            "EFL.2.2.d.27. Basic practices for participating in conversations: taking turns, listening attentively, looking at the speaker, and repeating or asking for clarification when needed.",
          ],
          procedimentales: [
            "EFL.2.2.p.5. Says one's own name, age and place of residence with simple phrases.",
            "EFL.2.2.p.12. Greets, takes leave, thanks and apologizes in short exchanges.",
            "EFL.2.2.p.13. Asks and answers about identity, place, and mood.",
          ],
          actitudinales: [
            "EFL.2.2.a.3. Is willing to speak in English.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.3",
    descripcion: "Recognition of protective signs in the places we live through the reading of words, drawings, and symbols, to interpret notices at school, in the street, and at home, valuing care as a shared form of protection between adults and children",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, and home.",
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, and lists.",
            "EFL.2.3.d.26. Basic features of signs and notices from the local environment: symbols, words, and colors.",
            "EFL.2.3.d.24. Different supports for short texts in the classroom: paper, cardboard, boards, and drawings.",
          ],
          procedimentales: [
            "EFL.2.3.p.32. Predicts the meaning of short illustrated texts using images and familiar words.",
            "EFL.2.3.p.20. Recognizes written words in everyday environmental texts such as notices, signs, and labels, using familiar vocabulary.",
            "EFL.2.3.p.21. Interprets basic written and visual signs related to care and safety at school and at home, using key vocabulary and symbols.",
          ],
          actitudinales: [
            "EFL.2.2.a.23. Cooperates with classmates in shared classroom tasks and activities.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, home, and neighbourhood.",
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, invitations, lists, and illustrated cards.",
            "EFL.2.3.d.26. Basic features of signs and notices from the local environment: symbols, words, colors, and location.",
          ],
          procedimentales: [
            "EFL.2.3.p.32. Predicts the meaning of short illustrated texts using images, titles, and familiar words.",
            "EFL.2.3.p.20. Recognizes written words and short phrases in everyday environmental texts such as notices, signs, and labels, using familiar vocabulary and basic print recognition.",
            "EFL.2.3.p.21. Interprets basic written and visual signs related to care, safety, and protection in school, on the street, and at home, using key vocabulary, symbols, and contextual cues.",
          ],
          actitudinales: [
            "EFL.2.2.a.23. Cooperates with classmates in shared tasks and activities.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, home, neighbourhood, and community.",
            "EFL.2.2.d.17. Simple questions with what, where, who, how, and how many.",
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, invitations, lists, and illustrated cards.",
            "EFL.2.3.d.26. Basic features of signs and notices from the local environment: symbols, words, colors, and location.",
          ],
          procedimentales: [
            "EFL.2.3.p.32. Predicts the meaning of short illustrated texts using images, titles, and familiar words.",
            "EFL.2.3.p.20. Recognizes of written words and short phrases in everyday environmental texts such as notices, signs, and labels, supporting initial reading comprehension through familiar vocabulary and basic print recognition.",
            "EFL.2.3.p.21. Interprets basic written and visual signs related to care, safety, and protection in school, on the street, and at home, using key vocabulary, symbols, and contextual cues to determine meaning.",
          ],
          actitudinales: [
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.4",
    descripcion: "Production of short notices for the classroom through posters with drawings and words in the languages used at home and in the community and in English, to invite classmates, families, and neighbors to share moments, promoting empathy and the classroom as a shared space",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, and home.",
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, and lists.",
            "EFL.2.4.d.5. Basic written conventions of English, including the alphabet and capitalization.",
            "EFL.2.4.d.20. Basic connectors to join words and simple ideas.",
          ],
          procedimentales: [
            "EFL.2.3.p.32. Predicts the meaning of short illustrated texts using images and familiar words.",
            "EFL.2.3.p.24. Associates written language and images to support meaning.",
            "EFL.2.4.p.25. Copies familiar words with visual support.",
            "EFL.2.4.p.26. Draws and labels familiar objects and beings from the immediate environment, connecting images with written words.",
            "EFL.2.4.p.27. Elaborates short posters with drawings and words for the classroom to communicate simple messages.",
            "EFL.2.2.p.44. Participates in creating classroom agreements using words and drawings with support.",
          ],
          actitudinales: [
            "EFL.2.2.a.22. Participates responsibly in familiar classroom agreements.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, home, and neighbourhood.",
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, invitations, lists, and illustrated cards.",
            "EFL.2.4.d.5. Basic written conventions of English, including the alphabet, capitalization, and common punctuation.",
            "EFL.2.4.d.20. Basic connectors to join ideas and express simple relationships.",
            "EFL.2.3.d.24. Different supports and formats for short texts in classroom and community environments: paper, cardboard, boards, walls, drawings, and screens.",
          ],
          procedimentales: [
            "EFL.2.3.p.32. Predicts the meaning of short illustrated texts using images, titles, and familiar words.",
            "EFL.2.3.p.24. Associates written language, images, and oral language to support meaning.",
            "EFL.2.4.p.25. Writes and copies familiar words and short phrases with visual support and basic decoding.",
            "EFL.2.4.p.26. Draws and labels objects, beings, and places of the environment, connecting images with written words.",
            "EFL.2.4.p.27. Elaborates short posters with drawings and words for the classroom and the community to communicate simple messages.",
            "EFL.2.2.p.44. Participates in the collective creation of classroom agreements using words and drawings.",
          ],
          actitudinales: [
            "EFL.2.2.a.22. Participates responsibly in the classroom's collective agreements.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, home, neighbourhood, and community.",
            "EFL.2.2.d.17. Simple questions with what, where, who, how, and how many.",
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, invitations, lists, and illustrated cards.",
            "EFL.2.4.d.5. Basic written conventions of English, including the alphabet, capitalization, and common punctuation.",
            "EFL.2.4.d.20. Initial use of basic connectors to join ideas and express simple relationships.",
            "EFL.2.3.d.24. Different supports and formats for short texts in classroom and community environments: paper, cardboard, boards, walls, drawings, and screens.",
          ],
          procedimentales: [
            "EFL.2.3.p.32. Predicts the meaning of short illustrated texts using images, titles, and familiar words.",
            "EFL.2.3.p.24. Associates written language, images, and oral language to support meaning.",
            "EFL.2.4.p.25. Writes and copies familiar words and short phrases with visual support and basic decoding.",
            "EFL.2.4.p.26. Draws and labels objects, beings, and places of the environment, connecting images with written words.",
            "EFL.2.4.p.27. Elaborates short posters with drawings and words for the classroom and the community to communicate simple messages.",
            "EFL.2.2.p.44. Participates in the collective creation of classroom agreements using words and drawings.",
          ],
          actitudinales: [
            "EFL.2.2.a.22. Participates responsibly in the classroom's collective agreements.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.5",
    descripcion: "Sensitivity toward those who need help, using simple expressions to ask for, offer, and thank for support in the languages used at home and in the community, and in English, to sustain care among classmates when something hurts, is missing, or feels difficult, recognizing that asking for help and offering it are ways of building the classroom as a safe place",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.15. Simple expressions for greeting, saying goodbye, and thanking.",
            "EFL.2.2.d.19. Simple expressions and imperatives used to ask, invite, and respond politely, such as come, look, listen, please, and thank you.",
            "EFL.2.2.d.28. Basic politeness expressions used in classroom interactions, including saying please, thank you, and sorry.",
          ],
          procedimentales: [
            "EFL.2.2.p.14. Requests help and permission with politeness formulas.",
            "EFL.2.2.p.15. Offers help and objects to a classmate.",
            "EFL.2.1.p.37. Asks for repetition when something is not understood.",
          ],
          actitudinales: [
            "EFL.2.2.a.4. Recognizes that learning English is shared work in the classroom.",
            "EFL.2.2.a.10. Asks for help when needed and offers it to classmates when possible.",
            "EFL.2.2.a.24. Shares with confidence what is learned in classroom activities.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.15. Simple expressions for greeting, saying goodbye, thanking, and interacting in familiar everyday situations.",
            "EFL.2.2.d.19. Simple expressions and imperatives used to ask, invite, offer help, and respond politely, including come, look, listen, help, please, thank you, and sorry.",
            "EFL.2.2.d.28. Basic politeness expressions used in everyday classroom interactions, including saying please, thank you, sorry, and excuse me.",
          ],
          procedimentales: [
            "EFL.2.2.p.14. Requests help, permission, and information with politeness formulas.",
            "EFL.2.2.p.15. Offers help, objects, and attention to a classmate.",
            "EFL.2.1.p.37. Asks for repetition or clarification when something is not understood.",
          ],
          actitudinales: [
            "EFL.2.2.a.4. Recognizes that learning English is shared work with classmates.",
            "EFL.2.2.a.10. Asks for help when needed and offers it when possible. Shares with confidence what is learned and asked in classroom activities.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.15. Simple expressions for greeting, saying goodbye, thanking, and interacting in everyday situations.",
            "EFL.2.2.d.19. Simple expressions and imperatives used to ask, invite, offer help, and respond politely (e.g., come, look, listen, help, please, thank you, sorry).",
            "EFL.2.2.d.28. Basic politeness expressions used in everyday classroom interactions, including saying \"please,\" \"thank you,\" \"sorry,\" \"excuse me,\" and \"you’re welcome.\".",
          ],
          procedimentales: [
            "EFL.2.2.p.14. Requests help, permission and information with politeness formulas.",
            "EFL.2.2.p.15. Offers help, objects and attention to a classmate.",
            "EFL.2.1.p.37. Ask for repetition, clarification or example when something is not understood.",
          ],
          actitudinales: [
            "EFL.2.2.a.4. Recognizes that learning English is shared work.",
            "EFL.2.2.a.24. Shares with confidence what is learned, asked, and explored in classroom activities.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.6",
    descripcion: "Mediation among languages in the classroom through the naming of meaningful words from the community within simple sentences, to sustain the entry of community knowledge into the classroom, valuing the languages of Ecuador as a common heritage",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.1. English as a language learned alongside the languages used at home.",
            "EFL.2.4.d.5. Basic written conventions of English, including the alphabet and capitalization.",
            "EFL.2.1.d.14. Words and expressions from local languages shared in familiar classroom experiences.",
          ],
          procedimentales: [
            "EFL.2.2.p.30. Names words from the languages of the place in short English phrases.",
            "EFL.2.1.p.31. Recognizes familiar words shared or close between the languages of the place and English.",
            "EFL.2.1.p.3. Identifies the general topic of a short audio using keywords and visual supports.",
          ],
          actitudinales: [
            "EFL.2.1.a.1. Shows curiosity about words and expressions in English.",
            "EFL.2.2.a.2. Accepts English as one language among others, with equal value to the languages used in the immediate environment.",
            "EFL.2.2.a.5. Values the languages of Ecuador used in the classroom as part of shared learning.",
            "EFL.2.2.a.6. Respects people who speak languages different from one's own.",
            "EFL.2.2.a.7. Appreciates words from local languages used in familiar classroom activities.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.1. English as a language learned and shared alongside the languages used at home and in the local community. Basic written conventions of English, including the alphabet, capitalization, and common punctuation.",
            "EFL.2.1.d.14. Words and expressions from local languages shared in classroom experiences as part of the common repertoire.",
          ],
          procedimentales: [
            "EFL.2.2.p.30. Uses words from the languages of the place in short English phrases.",
            "EFL.2.1.p.31. Recognizes words shared or close between the languages of the place and English in familiar oral and written contexts.",
            "EFL.2.1.p.3. Identifies the general topic of a short audio using keywords and visual supports with increasing independence.",
          ],
          actitudinales: [
            "EFL.2.1.a.1. Shows curiosity about how things are said in English and the language(s) used at home.",
            "EFL.2.2.a.2. Accepts English as one language among others, with equal value to other languages.",
            "EFL.2.2.a.5. Values the languages of Ecuador as part of the classroom repertoire.",
            "EFL.2.2.a.6. Respects people who speak different languages in the classroom and community.",
            "EFL.2.2.a.7. Appreciates words from local languages used in the classroom.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.4.d.5. Basic written conventions of English, including the alphabet, capitalization, and common punctuation.",
            "EFL.2.1.d.14. Words and expressions from local languages that are shared in classroom experiences as part of the common repertoire.",
          ],
          procedimentales: [
            "EFL.2.2.p.30. Names words from the languages of the place in short English phrases. Recognizes words shared or close between the languages of the place and English in different familiar contexts.",
            "EFL.2.1.p.3. Identifies the general topic of a short audio using keywords and visual supports.",
          ],
          actitudinales: [
            "EFL.2.1.a.1. Shows curiosity about how things are said in English and other languages.",
            "EFL.2.2.a.2. Accepts English as one language among others, with equal value to other languages.",
            "EFL.2.2.a.5. Values the languages of Ecuador as part of the classroom repertoire.",
            "EFL.2.2.a.6. Respects people who speak different languages.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.7",
    descripcion: "Demonstration of interest in what is done together with others, through simple expressions, to ask, suggest and accept invitations to play, sing, draw and rest with classmates, taking care that everyone shares what they give",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.15. Simple expressions for greeting, saying goodbye, and thanking.",
            "EFL.2.2.d.27. Basic practices for participating in conversations: taking turns, listening attentively, and looking at the speaker.",
            "EFL.2.2.d.28. Basic politeness expressions used in classroom interactions, including saying please, thank you, and sorry.",
            "EFL.2.2.d.36. Basic agreements for living together in the classroom, including mutual care and taking turns.",
          ],
          procedimentales: [
            "EFL.2.1.p.1. Recognizes greetings, introductions, and short instructions.",
            "EFL.2.2.p.6. Names familiar people, objects, and places in the immediate environment.",
            "EFL.2.2.p.12. Greets and takes leave in short exchanges.",
            "EFL.2.2.p.44. Participates in creating classroom agreements using words and drawings with support.",
            "EFL.2.2.p.16. Accepts invitations to shared activities using simple phrases.",
          ],
          actitudinales: [
            "EFL.2.2.a.3. Shows willingness to use simple English words and expressions.",
            "EFL.2.1.a.8. Listens attentively to others in English and in the languages of the place during familiar classroom interactions.",
            "EFL.2.2.a.9. Respects speaking turns in classroom interactions.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.27. Basic practices for participating in conversations: taking turns, listening attentively, looking at the speaker, and repeating when needed.",
            "EFL.2.2.d.15. Simple expressions for greeting, saying goodbye, thanking, and interacting in familiar everyday situations.",
            "EFL.2.2.d.28. Basic politeness expressions used in everyday classroom interactions, including saying please, thank you, sorry, and excuse me.",
            "EFL.2.2.d.36. Basic agreements for living together in the classroom, including mutual care, taking turns, and helping others.",
          ],
          procedimentales: [
            "EFL.2.1.p.1. Listens to greetings, introductions, short instructions, and simple questions.",
            "EFL.2.2.p.6. Names places, people, objects, and living beings in the surrounding environment. Greets, takes leave, and thanks in short exchanges. (Ref. EFL.2.p.12.) Participates in the collective creation of classroom agreements using words and drawings.",
            "EFL.2.2.p.16. Accepts invitations and invites others to shared activities using simple phrases.",
          ],
          actitudinales: [
            "EFL.2.2.a.3. Shows willingness to participate in simple interactions in English.",
            "EFL.2.1.a.8. Listens attentively to others in English and in the languages of the place during classroom and community interactions.",
            "EFL.2.2.a.9. Respects speaking turns in different classroom interactions.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.15. Simple expressions for greeting, saying goodbye, thanking, and interacting in everyday situations.",
            "EFL.2.2.d.27. Basic practices for participating in conversations: taking turns, listening attentively, looking at the speaker, and repeating or asking for clarification when needed.",
            "EFL.2.2.d.28. Basic politeness expressions used in everyday classroom interactions, including saying \"please,\" \"thank you,\" \"sorry,\" \"excuse me,\" and \"you’re welcome.\".",
            "EFL.2.2.d.36. Basic agreements for living together in the classroom, including mutual care, taking turns, helping others, and non-aggression.",
          ],
          procedimentales: [
            "EFL.2.2.p.12. Greets, takes leave, thanks and apologizes in short exchanges.",
            "EFL.2.2.p.44. Participates in the collective creation of classroom agreements using words and drawings.",
            "EFL.2.2.p.16. Accepts invitations and invite others to shared activities using simple phrases.",
          ],
          actitudinales: [
            "EFL.2.2.a.3. Is willing to speak in English.",
            "EFL.2.1.a.8. Listens attentively to others in English and in the languages of the place.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.8",
    descripcion: "Recognition that people think and feel in different ways, demonstrated by listening and sharing what each person brings to the classroom — words from their community, foods, games, songs, and stories — and by valuing the experiences, knowledge, and contributions each person shares with others",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.1. English as a language learned alongside the languages used at home.",
            "EFL.2.2.d.17. Simple questions with what and where.",
            "EFL.2.2.d.27. Basic practices for participating in conversations: taking turns, listening attentively, and looking at the speaker.",
            "EFL.2.1.d.14. Words and expressions from local languages shared in familiar classroom experiences.",
            "EFL.2.2.d.32. Awareness that English is learned and used by communities in different places.",
          ],
          procedimentales: [
            "EFL.2.2.p.45. Recognizes people in the classroom who support learning.",
          ],
          actitudinales: [
            "EFL.2.2.a.5. Values the languages of Ecuador used in the classroom as part of shared learning.",
            "EFL.2.2.a.6. Respects people who speak languages different from one's own.",
            "EFL.2.1.a.8. Listens attentively to others in English and in the languages of the place during familiar classroom interactions.",
            "EFL.2.2.a.11. Treats with respect classmates who think or feel differently.",
            "EFL.2.2.a.19. Recognizes that people in different places learn or use English.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.1. English as a language learned and shared alongside the languages used at home and in the local community. Simple questions with what, where, and who.",
            "EFL.2.2.d.27. Basic practices for participating in conversations: taking turns, listening attentively, looking at the speaker, and repeating when needed.",
            "EFL.2.1.d.14. Words and expressions from local languages shared in classroom experiences as part of the common repertoire.",
            "EFL.2.2.d.32. Awareness of the diversity of communities that learn or use English in different places and contexts.",
          ],
          procedimentales: [
            "EFL.2.2.p.45. Recognizes people in the classroom who support shared practices and learning.",
          ],
          actitudinales: [
            "EFL.2.2.a.5. Values the languages of Ecuador as part of the classroom repertoire.",
            "EFL.2.2.a.6. Respects people who speak different languages in the classroom and community.",
            "EFL.2.1.a.8. Listens attentively to others in English and in the languages of the place during classroom and community interactions.",
            "EFL.2.2.a.11. Treats with respect people in the classroom who think or feel differently.",
            "EFL.2.2.a.19. Recognizes communities in different places that use or learn English in their own contexts.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.17. Simple questions with what, where, who, how, and how many.",
            "EFL.2.2.d.27. Basic practices for participating in conversations: taking turns, listening attentively, looking at the speaker, and repeating or asking for clarification when needed.",
            "EFL.2.1.d.14. Words and expressions from local languages that are shared in classroom experiences as part of the common repertoire.",
            "EFL.2.2.d.32. Awareness of the diversity of communities that learn or use English in different places and contexts worldwide.",
          ],
          procedimentales: [
            "EFL.2.2.p.45. Recognizes people in the classroom who support shared practices and learning.",
          ],
          actitudinales: [
            "EFL.2.2.a.5. Values the languages of Ecuador as part of the classroom repertoire.",
            "EFL.2.2.a.6. Respects people who speak different languages.",
            "EFL.2.1.a.8. Listens attentively to others in English and in the languages of the place.",
            "EFL.2.2.a.11. Treats with respect those who think or feel differently.",
            "EFL.2.2.a.19. Recognizes communities around the world that use or learn English in their own contexts.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.9",
    descripcion: "Recognition of moods and feelings by identifying simple expressions in short stories, rhymes, and songs, to approach the literature of children and communities that learn or speak English in their own places, valuing the diverse ways of feeling and naming",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.32. Awareness that English is learned and used by communities in different places.",
            "EFL.2.1.d.3. Different ways of speaking English in familiar communities and places.",
            "EFL.2.1.d.12. Likes, dislikes, and preferences. Words and expressions to communicate basic emotions, likes, and dislikes.",
            "EFL.2.3.d.25. Basic elements of illustrated children’s books: cover, title, and illustrations.",
            "EFL.2.1.d.31. Basic vocabulary to name simple emotions, such as happy, sad, tired, and calm.",
          ],
          procedimentales: [
            "EFL.2.1.p.3. Identifies the general topic of a short audio using keywords and visual supports.",
            "EFL.2.1.p.2. Recognizes known words within short songs and rhymes.",
            "EFL.2.3.p.22. Reads very short, illustrated tales using images and familiar words to support understanding.",
            "EFL.2.2.p.17. Expresses likes and dislikes.",
            "EFL.2.1.p.34. Uses images and gestures as supports for understanding English.",
          ],
          actitudinales: [
            "EFL.2.2.a.19. Recognizes that people in different places learn or use English.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.32. Awareness of the diversity of communities that learn or use English in different places and contexts.",
            "EFL.2.1.d.3. Different pronunciations and ways of speaking English in diverse communities and places.",
            "EFL.2.1.d.12. Words and expressions to communicate emotions, likes, dislikes, and preferences.",
            "EFL.2.3.d.25. Basic elements of illustrated children’s books: cover, title, author, and illustrations.",
            "EFL.2.1.d.31. Basic vocabulary and short phrases to name simple emotions, such as happy, sad, tired, scared, excited, and calm.",
          ],
          procedimentales: [
            "EFL.2.1.p.3. Identifies the general topic of a short audio using keywords and visual supports with increasing independence.",
            "EFL.2.1.p.2. Recognizes known words within short songs, rhymes, and tales.",
            "EFL.2.3.p.22. Reads short, illustrated tales, using images and keywords to support understanding.",
            "EFL.2.2.p.17. Expresses likes, dislikes, and preferences.",
            "EFL.2.1.p.34. Uses images, gestures, and sounds as supports for understanding English.",
          ],
          actitudinales: [
            "EFL.2.2.a.19. Recognizes communities in different places that use or learn English in their own contexts.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.32. Awareness of the diversity of communities that learn or use English in different places and contexts worldwide.",
            "EFL.2.1.d.3. Different pronunciations, accents, and ways of speaking English in diverse communities and places.",
            "EFL.2.1.d.12. Words and expressions to communicate emotions, likes, dislikes, and preferences.",
            "EFL.2.3.d.25. Basic elements of illustrated children’s books: cover, title, author, and illustrations.",
            "EFL.2.1.d.31. Basic vocabulary and short phrases to name simple emotions, such as happy, sad, tired, scared, excited, and calm.",
          ],
          procedimentales: [
            "EFL.2.1.p.3. Identifies the general topic of a short audio using keywords and visual supports.",
            "EFL.2.1.p.2. Recognizes known words within short songs, rhymes and tales.",
            "EFL.2.3.p.22. Reads short, illustrated tales, using images and keywords to support understanding.",
            "EFL.2.2.p.17. Expresses like, dislike and preference.",
            "EFL.2.1.p.34. Uses images, gestures, and sounds as supports for understanding English.",
          ],
          actitudinales: [
            "EFL.2.2.a.9. Respects speaking turns in classroom interactions.",
            "EFL.2.2.a.19. Recognizes communities around the world that use or learn English in their own contexts.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.10",
    descripcion: "Valuing the festive life of our place through simple descriptions to name communal festivities, preserving the living memory of those who celebrate now and those who celebrated before",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.14. Words and expressions from local languages shared in familiar classroom experiences.",
            "EFL.2.1.d.11. Words and expressions related to games, songs, and celebrations from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, and songs shared within the community.",
          ],
          procedimentales: [
            "EFL.2.2.p.30. Names words from the languages of the place in short English phrases.",
            "EFL.2.2.p.11. Narrates familiar everyday events using simple oral phrases.",
          ],
          actitudinales: [
            "EFL.2.2.a.5. Values the languages of Ecuador used in the classroom as part of shared learning.",
            "EFL.2.2.a.7. Appreciates words from local languages used in familiar classroom activities.",
            "EFL.2.3.a.16. Enjoys the songs and games shared in the community.",
            "EFL.2.3.a.17. Values the living memory of the immediate place as knowledge.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.14. Words and expressions from local languages shared in classroom experiences as part of the common repertoire.",
            "EFL.2.1.d.11. Words and expressions related to games, songs, celebrations, and stories from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, songs, and stories transmitted and shared within the community.",
          ],
          procedimentales: [
            "EFL.2.2.p.30. Uses words from the languages of the place in short English phrases.",
            "EFL.2.2.p.11. Narrates everyday community events using simple oral phrases.",
          ],
          actitudinales: [
            "EFL.2.2.a.5. Values the languages of Ecuador as part of the classroom repertoire.",
            "EFL.2.2.a.7. Appreciates words from local languages used in the classroom. Enjoys the songs, games, stories, and festivities shared in the community.",
            "EFL.2.3.a.17. Values the living memory of the place as knowledge.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.14. Words and expressions from local languages that are shared in classroom experiences as part of the common repertoire.",
            "EFL.2.1.d.11. Words and expressions related to games, songs, celebrations, and stories from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, songs, and stories transmitted and shared within the community.",
          ],
          procedimentales: [
            "EFL.2.2.p.30. Names words from the languages of the place in short English phrases.",
            "EFL.2.2.p.11. Narrates everyday community events using simple oral phrases.",
          ],
          actitudinales: [
            "EFL.2.2.a.5. Values the languages of Ecuador as part of the classroom repertoire.",
            "EFL.2.3.a.16. Enjoys the songs, games, stories and festivities shared in the community.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.11",
    descripcion: "Exploration of singing as a shared practice through the performance of short songs to connect with children and communities that learn or speak English in different places, recognizing how each community expresses its voice, feelings, and traditions",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.2. Short oral texts used in everyday classroom interactions: greetings, songs, rhymes, and simple instructions. (Ref. EFL.1.d.22.) English as a shared language used to communicate with people from different places.",
            "EFL.2.2.d.32. Awareness that English is learned and used by communities in different places.",
            "EFL.2.1.d.3. Different ways of speaking English in familiar communities and places.",
            "EFL.2.1.d.11. Words and expressions related to games, songs, and celebrations from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, and songs shared within the community.",
            "EFL.2.1.d.4. Different English sounds and sound patterns similar to those of the languages of the local community.",
          ],
          procedimentales: [
            "EFL.2.2.p.45. Recognizes people in the classroom who support learning.",
            "EFL.2.1.p.2. Recognizes known words within short songs and rhymes.",
            "EFL.2.1.p.4. Distinguishes among different pronunciations in short audio recordings with visual or contextual support.",
            "EFL.2.2.p.7. Repeats and intones short rhymes and songs.",
            "EFL.2.2.p.8. Sings short and simple songs with support.",
            "EFL.2.2.p.35. Rehearses pronunciation of new words with support.",
            "EFL.2.2.p.38. Uses simple memory strategies such as drawing, play, and repetition to remember vocabulary.",
          ],
          actitudinales: [
            "EFL.2.2.a.2. Accepts English as one language among others, with equal value to the languages used in the immediate environment.",
            "EFL.2.2.a.19. Recognizes that people in different places learn or use English.",
            "EFL.2.3.a.16. Enjoys the songs and games shared in the community.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.2. English as a shared language used to communicate with people from different places and cultures.",
            "EFL.2.1.d.22. Short oral texts used in everyday classroom interactions: greetings, introductions, songs, rhymes, riddles, instructions, and simple descriptions.",
            "EFL.2.2.d.32. Awareness of the diversity of communities that learn or use English in different places and contexts.",
            "EFL.2.1.d.3. Different pronunciations and ways of speaking English in diverse communities and places.",
            "EFL.2.1.d.11. Words and expressions related to games, songs, celebrations, and stories from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, songs, and stories transmitted and shared within the community.",
            "EFL.2.1.d.4. Different English sounds and sound patterns, including those similar to and different from the languages of the local community.",
          ],
          procedimentales: [
            "EFL.2.2.p.45. Recognizes people in the classroom who support shared practices and learning.",
            "EFL.2.1.p.2. Recognizes known words within short songs, rhymes, and tales.",
            "EFL.2.1.p.4. Distinguishes among diverse pronunciations and accents in short audio recordings.",
            "EFL.2.2.p.7. Repeats and intones rhymes, tongue twisters, and short songs.",
            "EFL.2.2.p.8. Sings short and simple songs appropriate for the level.",
            "EFL.2.2.p.35. Rehearses pronunciation of new words and phrases.",
            "EFL.2.2.p.38. Uses simple memory strategies such as drawing, play, singing, and repetition to remember vocabulary.",
          ],
          actitudinales: [
            "EFL.2.2.a.2. Accepts English as one language among others, with equal value to other languages.",
            "EFL.2.2.a.19. Recognizes communities in different places that use or learn English in their own contexts.",
            "EFL.2.3.a.16. Enjoys the songs, games, stories, and festivities shared in the community.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.2. English as a shared language used to communicate with people from different places, cultures, and communities.",
            "EFL.2.1.d.22. Short oral texts used in everyday classroom and community interactions: greetings, introductions, songs, rhymes, riddles, instructions, and simple descriptions.",
            "EFL.2.2.d.32. Awareness of the diversity of communities that learn or use English in different places and contexts worldwide.",
            "EFL.2.1.d.3. Different pronunciations, accents, and ways of speaking English in diverse communities and places.",
            "EFL.2.1.d.11. Words and expressions related to games, songs, celebrations, and stories from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, songs, and stories transmitted and shared within the community.",
            "EFL.2.1.d.4. Different English sounds and sound patterns, including those similar to and different from the languages of the local community.",
          ],
          procedimentales: [
            "EFL.2.2.p.45. Recognizes people in the classroom who support shared practices and learning.",
            "EFL.2.1.p.2. Recognizes known words within short songs, rhymes and tales.",
            "EFL.2.1.p.4. Distinguishes among diverse pronunciations and accents in short audio recordings.",
            "EFL.2.2.p.7. Repeats and intones rhymes, tongue twisters and short songs.",
            "EFL.2.2.p.8. Sings short and simple songs appropriate for the level.",
            "EFL.2.2.p.35. Rehearses pronunciation of new words and phrases.",
            "EFL.2.2.p.38. Uses simple memory strategies such as drawing, play, singing, and repetition to remember vocabulary.",
          ],
          actitudinales: [
            "EFL.2.2.a.2. Accepts English as one language among others, with equal value to other languages.",
            "EFL.2.2.a.19. Recognizes communities around the world that use or learn English in their own contexts.",
            "EFL.2.3.a.16. Enjoys the songs, games, stories and festivities shared in the community.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.12",
    descripcion: "Organization of shared play through short riddles, rhymes and tongue-twisters, to take part in games of the classroom and of our place, recognizing playing together as knowledge passed down through generations",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.11. Short oral texts used in everyday classroom interactions: greetings, songs, rhymes, and simple instructions. (Ref. EFL.1.d.22.) Words and expressions related to games, songs, and celebrations from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, and songs shared within the community.",
          ],
          procedimentales: [
            "EFL.2.2.p.7. Repeats and intones short rhymes and songs.",
            "EFL.2.2.p.38. Uses simple memory strategies such as drawing, play, and repetition to remember vocabulary.",
            "EFL.2.2.p.9. Recites simple rhymes and verbal games suitable to this level.",
            "EFL.2.2.p.19. Takes part in collaborative games following short instructions with support.",
          ],
          actitudinales: [
            "EFL.2.3.a.16. Enjoys the songs and games shared in the community.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.22. Short oral texts used in everyday classroom interactions: greetings, introductions, songs, rhymes, riddles, instructions, and simple descriptions.",
            "EFL.2.1.d.11. Words and expressions related to games, songs, celebrations, and stories from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, songs, and stories transmitted and shared within the community.",
          ],
          procedimentales: [
            "EFL.2.2.p.7. Repeats and intones rhymes, tongue twisters, and short songs.",
            "EFL.2.2.p.38. Uses simple memory strategies such as drawing, play, singing, and repetition to remember vocabulary.",
            "EFL.2.2.p.9. Recites riddles, rhymes, and verbal games suitable to this level.",
            "EFL.2.2.p.19. Takes part in collaborative games following short instructions.",
          ],
          actitudinales: [
            "EFL.2.3.a.16. Enjoys the songs, games, stories, and festivities shared in the community.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.22. Short oral texts used in everyday classroom and community interactions: greetings, introductions, songs, rhymes, riddles, instructions, and simple descriptions.",
            "EFL.2.1.d.11. Words and expressions related to games, songs, celebrations, and stories from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, songs, and stories transmitted and shared within the community.",
          ],
          procedimentales: [
            "EFL.2.2.p.7. Repeats and intones rhymes, tongue twisters and short songs.",
            "EFL.2.2.p.38. Uses simple memory strategies such as drawing, play, singing, and repetition to remember vocabulary.",
            "EFL.2.2.p.9. Recites riddles, rhymes and verbal games suitable to this level.",
            "EFL.2.2.p.19. Takes part in collaborative games following short instructions.",
          ],
          actitudinales: [
            "EFL.2.3.a.16. Enjoys the songs, games, stories and festivities shared in the community.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.13",
    descripcion: "Exploration of aesthetic wonder through short descriptions and narratives to speak about images, drawings, weavings, ceramics, and other visual forms from the community and the world, recognizing the sensations, emotions, and ideas that emerge through observation",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.10. Words and expressions about foods, animals, and everyday objects from the local environment.",
          ],
          procedimentales: [
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, and animals from the immediate environment.",
            "EFL.2.1.p.33. Recognizes familiar words that are shared or similar between the languages of the place and English.",
          ],
          actitudinales: [
            "EFL.2.3.a.18. Appreciates visual forms such as drawings from their own place.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.10. Words and expressions about foods, animals, plants, and everyday objects from the local environment.",
          ],
          procedimentales: [
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, animals, and places from the environment.",
            "EFL.2.1.p.33. Recognizes words that are shared or similar between the languages of the place and English in familiar contexts.",
          ],
          actitudinales: [
            "EFL.2.3.a.18. Appreciates visual forms such as drawings, weavings, and ceramics from their own and other places.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.10. Words and expressions about foods, animals, plants, and everyday objects from the local environment.",
          ],
          procedimentales: [
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, animals, and places from the environment.",
            "EFL.2.1.p.33. Recognizes words that are shared or similar between the languages of the place and English.",
          ],
          actitudinales: [
            "EFL.2.3.a.18. Appreciates visual forms such as drawings, weavings, and ceramics from their own and other places.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.14",
    descripcion: "Exploration of short stories written or read in English by recognizing familiar expressions and overall meaning to connect with stories from communities that learn or speak English in different places, recognizing similarities and differences among experiences, traditions, and ways of life",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.2. English as a shared language used to communicate with people from different places.",
            "EFL.2.2.d.32. Awareness that English is learned and used by communities in different places.",
            "EFL.2.1.d.3. Different ways of speaking English in familiar communities and places.",
            "EFL.2.3.d.25. Basic elements of illustrated children’s books: cover, title, and illustrations.",
            "EFL.2.1.d.4. Different English sounds and sound patterns similar to those of the languages of the local community.",
          ],
          procedimentales: [
            "EFL.2.1.p.31. Recognizes familiar words shared or close between the languages of the place and English.",
            "EFL.2.1.p.2. Recognizes known words within short songs and rhymes.",
            "EFL.2.3.p.22. Reads very short, illustrated tales using images and familiar words to support understanding.",
            "EFL.2.1.p.34. Uses images and gestures as supports for understanding English.",
            "EFL.2.1.p.4. Distinguishes among different pronunciations in short audio recordings with visual or contextual support.",
            "EFL.2.1.p.36. Uses known words to approach new vocabulary with support.",
          ],
          actitudinales: [
            "EFL.2.1.a.1. Shows curiosity about words and expressions in English.",
            "EFL.2.2.a.19. Recognizes that people in different places learn or use English.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.2. English as a shared language used to communicate with people from different places and cultures.",
            "EFL.2.2.d.32. Awareness of the diversity of communities that learn or use English in different places and contexts.",
            "EFL.2.1.d.3. Different pronunciations and ways of speaking English in diverse communities and places.",
            "EFL.2.3.d.25. Basic elements of illustrated children’s books: cover, title, author, and illustrations.",
            "EFL.2.1.d.4. Different English sounds and sound patterns, including those similar to and different from the languages of the local community.",
          ],
          procedimentales: [
            "EFL.2.1.p.34. Uses images, gestures, and sounds as supports for understanding English.",
            "EFL.2.1.p.4. Distinguishes among diverse pronunciations and accents in short audio recordings.",
            "EFL.2.1.p.36. Uses known words to understand or approach new vocabulary.",
          ],
          actitudinales: [
            "EFL.2.1.a.1. Shows curiosity about how things are said in English and the language(s) used at home.",
            "EFL.2.2.a.19. Recognizes communities in different places that use or learn English in their own contexts.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.2. English as a shared language used to communicate with people from different places, cultures, and communities.",
            "EFL.2.2.d.22. Short oral texts used in everyday classroom and community interactions: greetings, introductions, songs, rhymes, riddles, instructions, and simple descriptions.",
            "EFL.2.2.d.32. Awareness of the diversity of communities that learn or use English in different places and contexts worldwide.",
            "EFL.2.1.d.3. Different pronunciations, accents, and ways of speaking English in diverse communities and places.",
            "EFL.2.3.d.25. Basic elements of illustrated children’s books: cover, title, author, and illustrations.",
            "EFL.2.1.d.4. Different English sounds and sound patterns, including those similar to and different from the languages of the local community.",
          ],
          procedimentales: [
            "EFL.2.1.p.31. Recognizes words shared or close between the languages of the place and English in different familiar contexts.",
            "EFL.2.1.p.2. Recognizes known words within short songs, rhymes and tales.",
            "EFL.2.3.p.22. Reads short, illustrated tales, using images and keywords to support understanding.",
            "EFL.2.1.p.34. Uses images, gestures, and sounds as supports for understanding English.",
            "EFL.2.1.p.4. Distinguishes among diverse pronunciations and accents in short audio recordings.",
            "EFL.2.1.p.36. Uses known words to understand or approach new vocabulary.",
          ],
          actitudinales: [
            "EFL.2.1.a.1. Shows curiosity about how things are said in English and other languages.",
            "EFL.2.2.a.19. Recognizes communities around the world that use or learn English in their own contexts.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.15",
    descripcion: "Preservation of the living memory of our place, through simple expressions in English, to share what is done daily at home and in the community, recognizing those who have done and continue to do these practices",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.8. Words and expressions about family and close people.",
            "EFL.2.1.d.14. Words and expressions from local languages shared in familiar classroom experiences.",
            "EFL.2.1.d.11. Words and expressions related to games, songs, and celebrations from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, and songs shared within the community.",
          ],
          procedimentales: [
            "EFL.2.2.p.30. Names words from the languages of the place in short English phrases.",
            "EFL.2.2.p.45. Recognizes people in the classroom who support learning.",
            "EFL.2.2.p.11. Narrates familiar everyday events using simple oral phrases.",
          ],
          actitudinales: [
            "EFL.2.2.a.7. Appreciates words from local languages used in familiar classroom activities.",
            "EFL.2.3.a.16. Enjoys the songs and games shared in the community.",
            "EFL.2.3.a.17. Values the living memory of the immediate place as knowledge.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.8. Words and expressions about family, close people, and relationships of care.",
            "EFL.2.1.d.14. Words and expressions from local languages shared in classroom experiences as part of the common repertoire.",
            "EFL.2.1.d.11. Words and expressions related to games, songs, celebrations, and stories from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, songs, and stories transmitted and shared within the community.",
          ],
          procedimentales: [
            "EFL.2.2.p.30. Words and expressions about family, close people, and relationships of care. (Ref. EFL.2.d.8.) Uses words from the languages of the place in short English phrases.",
            "EFL.2.2.p.45. Recognizes people in the classroom who support shared practices and learning.",
            "EFL.2.2.p.11. Narrates everyday community events using simple oral phrases.",
          ],
          actitudinales: [
            "EFL.2.2.a.7. Appreciates words from local languages used in the classroom. Enjoys the songs, games, stories, and festivities shared in the community.",
            "EFL.2.3.a.17. Values the living memory of the place as knowledge.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.8. Words and expressions about family, close people, and relationships of care.",
            "EFL.2.1.d.14. Words and expressions from local languages that are shared in classroom experiences as part of the common repertoire.",
            "EFL.2.1.d.11. Words and expressions related to games, songs, celebrations, and stories from the local culture and community.",
            "EFL.2.3.d.34. Festivities, games, songs, and stories transmitted and shared within the community.",
          ],
          procedimentales: [
            "EFL.2.2.p.30. Names words from the languages of the place in short English phrases.",
            "EFL.2.2.p.45. Recognizes people in the classroom who support shared practices and learning.",
            "EFL.2.2.p.11. Narrates everyday community events using simple oral phrases.",
          ],
          actitudinales: [
            "EFL.2.3.a.16. Enjoys the songs, games, stories and festivities shared in the community.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.16",
    descripcion: "Expansion of cultural awareness through short texts in English about foods, plants, objects, and tools from the community, to describe what they are, what they are used for, and where they come from, recognizing the diversity of knowledge and community practices around them",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.4.d.20. Basic connectors to join words and simple ideas.",
            "EFL.2.1.d.14. Words and expressions from local languages shared in familiar classroom experiences.",
            "EFL.2.1.d.10. Words and expressions about foods, animals, and everyday objects from the local environment.",
            "EFL.2.1.d.13. Words and expressions about nearby animals, plants, and natural places.",
            "EFL.2.1.d.21. Everyday situations. Numbers, colors, shapes, and basic sizes used in everyday situations.",
            "EFL.2.1.d.35. Plants and animals of Ecuador.",
          ],
          procedimentales: [
            "EFL.2.2.p.6. Names familiar people, objects, and places in the immediate environment.",
            "EFL.2.3.p.24. Associates written language and images to support meaning.",
            "EFL.2.4.p.26. Draws and labels familiar objects and beings from the immediate environment, connecting images with written words.",
            "EFL.2.2.p.30. Names words from the languages of the place in short English phrases.",
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, and animals from the immediate environment.",
            "EFL.2.1.p.36. Uses known words to approach new vocabulary with support.",
            "EFL.2.3.p.23. Identifies simple information in cards and lists using familiar vocabulary.",
            "EFL.2.4.p.29. Completes simple lists and cards with known vocabulary.",
            "EFL.2.2.p.42. Describes plants, animals, and foods from the environment using simple phrases.",
          ],
          actitudinales: [
            "EFL.2.2.a.7. Appreciates words from local languages used in familiar classroom activities.",
            "EFL.2.4.a.20. Cares for living beings and places named in classroom activities.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.4.d.20. Basic connectors to join ideas and express simple relationships.",
            "EFL.2.1.d.14. Words and expressions from local languages shared in classroom experiences as part of the common repertoire.",
            "EFL.2.1.d.10. Words and expressions about foods, animals, plants, and everyday objects from the local environment.",
            "EFL.2.1.d.13. Words and expressions about the nearby natural world: rivers, mountains, forests, animals, and plants.",
            "EFL.2.1.d.21. Numbers, colors, shapes, sizes, and quantities used in everyday situations.",
            "EFL.2.1.d.35. Plants, animals, rivers, mountains, and forests of Ecuador.",
          ],
          procedimentales: [
            "EFL.2.2.p.6. Names places, people, objects, and living beings in the surrounding environment. Associates written language, images, and oral language to support meaning.",
            "EFL.2.4.p.26. Draws and labels objects, beings, and places of the environment, connecting images with written words.",
            "EFL.2.2.p.30. Uses words from the languages of the place in short English phrases.",
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, animals, and places from the environment.",
            "EFL.2.1.p.36. Uses known words to understand or approach new vocabulary.",
            "EFL.2.3.p.23. Identifies simple information in cards, lists, and short descriptive texts using familiar vocabulary.",
            "EFL.2.4.p.29. Completes simple lists, cards, and forms with known vocabulary.",
            "EFL.2.2.p.42. Describes plants, animals, foods, and tools from the environment using simple phrases.",
          ],
          actitudinales: [
            "EFL.2.2.a.7. Appreciates words from local languages used in the classroom. Cares for living beings and places named in classroom activities, showing respect and responsibility.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.4.d.20. Initial use of basic connectors to join ideas and express simple relationships.",
            "EFL.2.1.d.14. Words and expressions from local languages that are shared in classroom experiences as part of the common repertoire.",
            "EFL.2.1.d.10. Words and expressions about foods, animals, plants, and everyday objects from the local environment.",
            "EFL.2.1.d.13. Words and expressions about the nearby natural world: rivers, mountains, forests, animals, and plants.",
            "EFL.2.1.d.21. Numbers, colors, shapes, sizes, and quantities used in everyday situations.",
          ],
          procedimentales: [
            "EFL.2.3.p.24. Associates written language, images, and oral language to support meaning.",
            "EFL.2.4.p.26. Draws and labels objects, beings, and places of the environment, connecting images with written words.",
            "EFL.2.2.p.30. Names words from the languages of the place in short English phrases.",
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, animals, and places from the environment.",
            "EFL.2.1.p.36. Uses known words to understand or approach new vocabulary.",
            "EFL.2.3.p.23. Identifies simple information in cards, lists, and short descriptive texts using familiar vocabulary.",
            "EFL.2.4.p.29. Completes simple lists, cards and forms with known vocabulary.",
            "EFL.2.2.p.42. Describes plants, animals, foods, and tools from the environment using simple phrases.",
          ],
          actitudinales: [
            "EFL.2.4.a.20. Cares for living beings and places named in classroom activities, showing respect and responsibility.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.17",
    descripcion: "Recognition of moments when the body is cared for, using simple English expressions to name places, people, and ways of caring for the body, recognizing the importance of relationships, routines, and well-being, and beginning to write short lines that name what is read",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.8. Words and expressions about family and close people.",
            "EFL.2.1.d.31. Basic vocabulary to name simple emotions, such as happy, sad, tired, and calm.",
            "EFL.2.1.d.9. Words and expressions about the body and its main parts.",
            "EFL.2.1.d.33. For the body. Everyday ways of moving, resting, and playing.",
          ],
          procedimentales: [
            "EFL.2.2.p.39. Describes parts of the body using simple phrases.",
            "EFL.2.2.p.40. Names places where the body is cared for.",
          ],
          actitudinales: [
            "EFL.2.4.a.13. Cares for their own body during learning activities.",
            "EFL.2.4.a.14. Recognizes family members who support care of the body.",
            "EFL.2.4.a.15. Values knowledge about the body and healthy habits.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.8. Words and expressions about family, close people, and relationships of care.",
            "EFL.2.1.d.31. Basic vocabulary and short phrases to name simple emotions, such as happy, sad, tired, scared, excited, and calm.",
            "EFL.2.1.d.9. Words and expressions about the body, its parts, and basic states of well-being.",
            "EFL.2.1.d.33. Everyday ways of moving, resting, playing, and caring for the body.",
          ],
          procedimentales: [
            "EFL.2.2.p.39. Describes parts of the body and basic ways to care for them using simple phrases.",
            "EFL.2.2.p.40. Names moments and places where the body is cared for.",
          ],
          actitudinales: [
            "EFL.2.4.a.13. Cares for their own body and respects classmates during learning activities.",
            "EFL.2.4.a.14. Recognizes family and community members who support care of the body.",
            "EFL.2.4.a.15. Values knowledge about the body, movement, and healthy habits.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.8. Words and expressions about family, close people, and relationships of care.",
            "EFL.2.1.d.31. Basic vocabulary and short phrases to name simple emotions, such as happy, sad, tired, scared, excited, and calm.",
            "EFL.2.1.d.9. Words and expressions about the body, its parts, and basic states of well-being.",
            "EFL.2.1.d.33. Everyday ways of moving, resting, playing, and caring for the body.",
          ],
          procedimentales: [
            "EFL.2.2.p.39. Describes parts of the body and basic ways to care for them using simple phrases.",
            "EFL.2.2.p.40. Names moments and places where the body is cared for.",
          ],
          actitudinales: [
            "EFL.2.4.a.13. Cares for their own body and respects classmates during learning activities.",
            "EFL.2.4.a.14. Recognizes family and community members who support care of the body.",
            "EFL.2.4.a.15. Values knowledge about the body, movement, and healthy habits.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.18",
    descripcion: "Valuing one's own preferences and those of classmates through simple expressions about what one likes, what one does not like, and what one likes sometimes, recognizing that each person has different tastes",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.16. Simple affirmative sentences using I am and This is.",
            "EFL.2.2.d.36. Basic agreements for living together in the classroom, including mutual care and taking turns.",
            "EFL.2.1.d.12. Likes, dislikes, and preferences. Words and expressions to communicate basic emotions, likes, and dislikes.",
            "EFL.2.1.d.6. Words and expressions about personal identity: name, age, and basic feelings in familiar communicative situations.",
            "EFL.2.2.d.18. Basic ways to express absence and negation with no / I don't.",
            "EFL.2.2.d.30. Basic formulas to express like and dislike: I like, I don't like.",
          ],
          procedimentales: [
            "EFL.2.2.p.13. Says one's own name with simple words or phrases. (Ref. EFL.2.p.5.) Answers simple questions about identity and place.",
            "EFL.2.2.p.17. Expresses likes and dislikes.",
            "EFL.2.2.p.18. Expresses simple disagreement respectfully.",
            "EFL.2.4.p.28. Writes simple affirmative sentences about oneself and one's likes.",
          ],
          actitudinales: [
            "EFL.2.2.a.3. Shows willingness to use simple English words and expressions.",
            "EFL.2.2.a.11. Treats with respect classmates who think or feel differently.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.8. Words and expressions about family, close people, and relationships of care.",
            "EFL.2.2.d.16. Simple affirmative sentences using I am, you are, this is.",
            "EFL.2.2.d.36. Basic agreements for living together in the classroom, including mutual care, taking turns, and helping others.",
            "EFL.2.1.d.12. Words and expressions to communicate emotions, likes, dislikes, and preferences.",
            "EFL.2.1.d.6. Words and expressions about personal identity: name, age, and feelings in familiar oral and visual contexts.",
            "EFL.2.2.d.18. Basic ways to express absence, negation, and simple disagreement with no / I don't / there isn't.",
            "EFL.2.2.d.30. Basic formulas to express like and dislike: I like, I don't like, sometimes I like.",
          ],
          procedimentales: [
            "EFL.2.2.p.5. Says one's own name and age with simple phrases.",
            "EFL.2.2.p.13. Names places, people, objects, and living beings in the surrounding environment. (Ref. EFL.2.p.6.) Asks and answers about identity and place.",
            "EFL.2.2.p.17. Expresses likes, dislikes, and preferences.",
            "EFL.2.2.p.18. Expresses disagreement respectfully and without aggression.",
            "EFL.2.4.p.28. Writes simple affirmative and negative sentences about oneself, one's place, and one's likes.",
          ],
          actitudinales: [
            "EFL.2.2.a.3. Shows willingness to participate in simple interactions in English.",
            "EFL.2.2.a.11. Treats with respect people in the classroom who think or feel differently.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.16. Simple affirmative sentences using I am, you are, this is.",
            "EFL.2.2.d.36. Basic agreements for living together in the classroom, including mutual care, taking turns, helping others, and non-aggression.",
            "EFL.2.1.d.12. Words and expressions to communicate emotions, likes, dislikes, and preferences.",
            "EFL.2.1.d.35. Plants, animals, rivers, mountains, and forests of Ecuador and the Americas.",
            "EFL.2.1.d.6. Words and expressions about personal identity: name, age, and feelings used in familiar communicative situations, supporting recognition and understanding of everyday vocabulary in oral and visual context.",
            "EFL.2.2.d.18. Basic ways to express absence, negation, and simple disagreement with no / I don't / there isn't.",
            "EFL.2.2.d.30. Basic formulas to express like and dislike: I like, I don't like, sometimes I like.",
          ],
          procedimentales: [
            "EFL.2.2.p.5. Says one's own name, age and place of residence with simple phrases.",
            "EFL.2.2.p.13. Asks and answers about identity, place, and mood.",
            "EFL.2.2.p.17. Expresses like, dislike and preference.",
            "EFL.2.2.p.18. Expresses disagreement respectfully and without aggression.",
            "EFL.2.4.p.28. Writes simple affirmative and negative sentences about oneself, one's place, and one's likes.",
          ],
          actitudinales: [
            "EFL.2.2.a.3. Is willing to speak in English.",
            "EFL.2.2.a.11. Treats with respect those who think or feel differently.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.19",
    descripcion: "Understanding and producing simple instructions to move the body through simple expressions, to play with classmates, and recognizing the importance of the body in play and the care it needs",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.22. Short oral texts used in everyday classroom interactions: greetings, songs, rhymes, and simple instructions.",
            "EFL.2.2.d.19. Simple expressions and imperatives used to ask, invite, and respond politely, such as come, look, listen, please, and thank you.",
            "EFL.2.1.d.9. Words and expressions about the body and its main parts.",
            "EFL.2.1.d.33. For the body. Everyday ways of moving, resting, and playing.",
          ],
          procedimentales: [
            "EFL.2.2.p.35. Rehearses pronunciation of new words with support.",
            "EFL.2.2.p.19. Takes part in collaborative games following short instructions with support.",
            "EFL.2.2.p.39. Describes parts of the body using simple phrases.",
            "EFL.2.1.p.41. Follows short instructions to move and play.",
          ],
          actitudinales: [
            "EFL.2.4.a.13. Cares for their own body during learning activities.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.22. Short oral texts used in everyday classroom interactions: greetings, introductions, songs, rhymes, riddles, instructions, and simple descriptions.",
            "EFL.2.2.d.19. Simple expressions and imperatives used to ask, invite, offer help, and respond politely, including come, look, listen, help, please, thank you, and sorry.",
            "EFL.2.1.d.9. Words and expressions about the body, its parts, and basic states of well-being.",
            "EFL.2.1.d.33. Everyday ways of moving, resting, playing, and caring for the body.",
          ],
          procedimentales: [
            "EFL.2.2.p.35. Rehearses pronunciation of new words and phrases.",
            "EFL.2.2.p.19. Takes part in collaborative games following short instructions.",
            "EFL.2.2.p.39. Describes parts of the body and basic ways to care for them using simple phrases.",
            "EFL.2.1.p.41. Follows short instructions to move, play, and rest.",
          ],
          actitudinales: [
            "EFL.2.4.a.13. Cares for their own body and respects classmates during learning activities.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.22. Short oral texts used in everyday classroom and community interactions: greetings, introductions, songs, rhymes, riddles, instructions, and simple descriptions.",
            "EFL.2.2.d.19. Simple expressions and imperatives used to ask, invite, offer help, and respond politely (e.g., come, look, listen, help, please, thank you, sorry).",
            "EFL.2.1.d.9. Words and expressions about the body, its parts, and basic states of well-being.",
            "EFL.2.1.d.33. Everyday ways of moving, resting, playing, and caring for the body.",
          ],
          procedimentales: [
            "EFL.2.2.p.35. Rehearses pronunciation of new words and phrases.",
            "EFL.2.2.p.19. Takes part in collaborative games following short instructions.",
            "EFL.2.2.p.39. Describes parts of the body and basic ways to care for them using simple phrases.",
            "EFL.2.1.p.41. Follows short instructions to move, play and rest.",
          ],
          actitudinales: [
            "EFL.2.4.a.13. Cares for their own body and respects classmates during learning activities.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.20",
    descripcion: "Recognition of sources that provide information about the community and the world through short descriptions of books, posters, and images, to find simple information on topics of interest, recognizing that knowledge comes from many voices and experiences",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, and home.",
            "EFL.2.2.d.17. Simple questions with what and where.",
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, and lists.",
            "EFL.2.4.d.20. Basic connectors to join words and simple ideas.",
            "EFL.2.3.d.24. Different supports for short texts in the classroom: paper, cardboard, boards, and drawings.",
            "EFL.2.3.d.25. Basic elements of illustrated children’s books: cover, title, and illustrations.",
          ],
          procedimentales: [
            "EFL.2.1.p.3. Identifies the general topic of a short audio using keywords and visual supports.",
            "EFL.2.3.p.23. Identifies simple information in cards and lists using familiar vocabulary.",
            "EFL.2.3.p.47. Consults books, notices, and images to seek simple information about the immediate environment.",
            "EFL.2.2.p.48. Shares orally with the group what has been learned from a short consultation with support.",
          ],
          actitudinales: [
            "EFL.2.2.a.24. Shares with confidence what is learned in classroom activities.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, home, and neighbourhood.",
            "EFL.2.2.d.17. Simple questions with what, where, and who.",
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, invitations, lists, and illustrated cards.",
            "EFL.2.4.d.20. Basic connectors to join ideas and express simple relationships.",
            "EFL.2.3.d.24. Different supports and formats for short texts in classroom and community environments: paper, cardboard, boards, walls, drawings, and screens.",
            "EFL.2.3.d.25. Basic elements of illustrated children’s books: cover, title, author, and illustrations.",
          ],
          procedimentales: [
            "EFL.2.1.p.3. Identifies the general topic of a short audio using keywords and visual supports with increasing independence.",
            "EFL.2.3.p.23. Identifies simple information in cards, lists, and short descriptive texts using familiar vocabulary.",
            "EFL.2.3.p.47. Consults books, notices, and images to seek simple information about the place and the world.",
            "EFL.2.2.p.48. Shares orally with the group what has been learned from a short consultation.",
          ],
          actitudinales: [
            "EFL.2.2.a.24. Shares with confidence what is learned and asked in classroom activities.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.7. Words and expressions about nearby places: classroom, school, home, neighbourhood, and community.",
            "EFL.2.2.d.17. Simple questions with what, where, who, how, and how many.",
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, invitations, lists, and illustrated cards.",
            "EFL.2.4.d.20. Initial use of basic connectors to join ideas and express simple relationships.",
            "EFL.2.3.d.24. Different supports and formats for short texts in classroom and community environments: paper, cardboard, boards, walls, drawings, and screens.",
            "EFL.2.3.d.25. Basic elements of illustrated children’s books: cover, title, author, and illustrations.",
          ],
          procedimentales: [
            "EFL.2.1.p.3. Identifies the general topic of a short audio using keywords and visual supports.",
            "EFL.2.3.p.23. Identifies simple information in cards, lists, and short descriptive texts using familiar vocabulary.",
            "EFL.2.3.p.47. Consults books, notices and images to seek simple information about the place and the world.",
            "EFL.2.2.p.48. Shares orally with the group what has been learned from a short consultation.",
          ],
          actitudinales: [
            "EFL.2.2.a.24. Shares with confidence what is learned, asked, and explored in classroom activities.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.21",
    descripcion: "Exploration of cooperation among classmates by following short instructions to build classroom and play objects, recognizing that what is built together sustains the classroom as a space of common making",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.19. Simple expressions and imperatives used to ask, invite, and respond politely, such as come, look, listen, please, and thank you.",
            "EFL.2.2.d.28. Basic politeness expressions used in classroom interactions, including saying please, thank you, and sorry.",
            "EFL.2.2.d.29. Basic formulas for requesting help, such as can you help me?.",
          ],
          procedimentales: [
            "EFL.2.2.p.14. Requests help and permission with politeness formulas.",
            "EFL.2.2.p.15. Offers help and objects to a classmate.",
            "EFL.2.2.p.19. Takes part in collaborative games following short instructions with support.",
            "EFL.2.1.p.41. Follows short instructions to move and play.",
            "EFL.2.2.p.46. Builds simple classroom or play objects following short instructions with a classmate and support.",
          ],
          actitudinales: [
            "EFL.2.2.a.23. Cooperates with classmates in shared classroom tasks and activities.",
            "EFL.2.2.a.4. Recognizes that learning English is shared work in the classroom.",
            "EFL.2.2.a.10. Asks for help when needed and offers it to classmates when possible.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.19. Simple expressions and imperatives used to ask, invite, offer help, and respond politely, including come, look, listen, help, please, thank you, and sorry.",
            "EFL.2.2.d.28. Basic politeness expressions used in everyday classroom interactions, including saying please, thank you, sorry, and excuse me.",
            "EFL.2.2.d.29. Basic formulas for requesting and providing help, such as can you help me?, I can help you, and here you are.",
          ],
          procedimentales: [
            "EFL.2.2.p.14. Requests help, permission, and information with politeness formulas.",
            "EFL.2.2.p.15. Offers help, objects, and attention to a classmate.",
            "EFL.2.2.p.19. Takes part in collaborative games following short instructions.",
            "EFL.2.1.p.41. Follows short instructions to move, play, and rest.",
            "EFL.2.2.p.46. Builds classroom and play objects following short instructions with a classmate.",
          ],
          actitudinales: [
            "EFL.2.2.a.23. Cooperates with classmates in shared tasks and activities. Recognizes that learning English is shared work with classmates.",
            "EFL.2.2.a.10. Asks for help when needed and offers it when possible.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.2.d.19. Simple expressions and imperatives used to ask, invite, offer help, and respond politely (e.g., come, look, listen, help, please, thank you, sorry).",
            "EFL.2.2.d.28. Basic politeness expressions used in everyday classroom interactions, including saying \"please,\" \"thank you,\" \"sorry,\" \"excuse me,\" and \"you’re welcome.\".",
            "EFL.2.2.d.29. Basic formulas for requesting and providing help, such as can you help me?, I can help you, and here you are.",
          ],
          procedimentales: [
            "EFL.2.2.p.14. Requests help, permission and information with politeness formulas.",
            "EFL.2.2.p.15. Offers help, objects and attention to a classmate.",
            "EFL.2.2.p.19. Takes part in collaborative games following short instructions.",
            "EFL.2.1.p.41. Follows short instructions to move, play and rest.",
            "EFL.2.2.p.46. Builds classroom and play objects following short instructions with a classmate.",
          ],
          actitudinales: [
            "EFL.2.2.a.4. Recognizes that learning English is shared work.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.22",
    descripcion: "Building small agreements for classroom coexistence through expressions and short posters about what is agreed and what is not when being together, promoting the classroom as a respectful, safe, and shared space",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, and lists.",
            "EFL.2.3.d.26. Basic features of signs and notices from the local environment: symbols, words, and colors.",
            "EFL.2.4.d.5. Basic written conventions of English, including the alphabet and capitalization.",
            "EFL.2.3.d.24. Different supports for short texts in the classroom: paper, cardboard, boards, and drawings.",
            "EFL.2.2.d.18. Basic ways to express absence and negation with no / I don't.",
          ],
          procedimentales: [
            "EFL.2.3.p.20. Recognizes written words in everyday environmental texts such as notices, signs, and labels, using familiar vocabulary.",
            "EFL.2.4.p.25. Copies familiar words with visual support.",
            "EFL.2.4.p.27. Elaborates short posters with drawings and words for the classroom to communicate simple messages.",
            "EFL.2.2.p.45. Recognizes people in the classroom who support learning.",
            "EFL.2.2.p.18. Expresses simple disagreement respectfully.",
            "EFL.2.4.p.28. Writes simple affirmative sentences about oneself and one's likes.",
          ],
          actitudinales: [
            "EFL.2.2.a.22. Participates responsibly in familiar classroom agreements.",
            "EFL.2.2.a.12. Accepts that saying no is part of respectful classroom life.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, invitations, lists, and illustrated cards.",
            "EFL.2.3.d.26. Basic features of signs and notices from the local environment: symbols, words, colors, and location.",
            "EFL.2.4.d.5. Basic written conventions of English, including the alphabet, capitalization, and common punctuation.",
            "EFL.2.3.d.24. Different supports and formats for short texts in classroom and community environments: paper, cardboard, boards, walls, drawings, and screens.",
            "EFL.2.2.d.18. Basic ways to express absence, negation, and simple disagreement with no / I don't / there isn't.",
          ],
          procedimentales: [
            "EFL.2.3.p.20. Recognizes written words and short phrases in everyday environmental texts such as notices, signs, and labels, using familiar vocabulary and basic print recognition.",
            "EFL.2.4.p.25. Writes and copies familiar words and short phrases with visual support and basic decoding.",
            "EFL.2.4.p.27. Elaborates short posters with drawings and words for the classroom and the community to communicate simple messages.",
            "EFL.2.2.p.45. Recognizes people in the classroom who support shared practices and learning.",
            "EFL.2.2.p.18. Expresses disagreement respectfully and without aggression.",
            "EFL.2.4.p.28. Writes simple affirmative and negative sentences about oneself, one's place, and one's likes.",
          ],
          actitudinales: [
            "EFL.2.2.a.22. Participates responsibly in the classroom's collective agreements.",
            "EFL.2.2.a.12. Accepts that saying no and disagreeing are part of respectful classroom life.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.3.d.23. Short written texts used in everyday situations: notices, signs, labels, invitations, lists, and illustrated cards.",
            "EFL.2.3.d.26. Basic features of signs and notices from the local environment: symbols, words, colors, and location.",
            "EFL.2.4.d.5. Basic written conventions of English, including the alphabet, capitalization, and common punctuation.",
            "EFL.2.3.d.24. Different supports and formats for short texts in classroom and community environments: paper, cardboard, boards, walls, drawings, and screens.",
            "EFL.2.2.d.18. Basic ways to express absence, negation, and simple disagreement with no / I don't / there isn't.",
          ],
          procedimentales: [
            "EFL.2.3.p.20. Recognizes of written words and short phrases in everyday environmental texts such as notices, signs, and labels, supporting initial reading comprehension through familiar vocabulary and basic print recognition.",
            "EFL.2.4.p.25. Writes and copies familiar words and short phrases with visual support and basic decoding.",
            "EFL.2.4.p.27. Elaborates short posters with drawings and words for the classroom and the community to communicate simple messages.",
            "EFL.2.2.p.45. Recognizes people in the classroom who support shared practices and learning.",
            "EFL.2.2.p.18. Expresses disagreement respectfully and without aggression.",
            "EFL.2.4.p.28. Writes simple affirmative and negative sentences about oneself, one's place, and one's likes.",
          ],
          actitudinales: [
            "EFL.2.2.a.22. Participates responsibly in the classroom's collective agreements.",
            "EFL.2.2.a.12. Accepts that saying no and disagreeing are part of respectful classroom life.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.23",
    descripcion: "Understanding of images and words about the body and what cares for it, through diagrams and short descriptions, to name parts of the body and plants of our place that care, recognizing those who know about the body in the community",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.10. Words and expressions about foods, animals, and everyday objects from the local environment.",
            "EFL.2.1.d.21. Everyday situations. Numbers, colors, shapes, and basic sizes used in everyday situations.",
            "EFL.2.1.d.9. Words and expressions about the body and its main parts.",
            "EFL.2.1.d.33. For the body. Everyday ways of moving, resting, and playing.",
          ],
          procedimentales: [
            "EFL.2.3.p.24. Associates written language and images to support meaning.",
            "EFL.2.4.p.25. Copies familiar words with visual support.",
            "EFL.2.4.p.26. Draws and labels familiar objects and beings from the immediate environment, connecting images with written words.",
            "EFL.2.1.p.34. Uses images and gestures as supports for understanding English.",
            "EFL.2.2.p.38. Uses simple memory strategies such as drawing, play, and repetition to remember vocabulary.",
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, and animals from the immediate environment.",
            "EFL.2.4.p.29. Completes simple lists and cards with known vocabulary.",
            "EFL.2.2.p.42. Describes plants, animals, and foods from the environment using simple phrases.",
            "EFL.2.2.p.39. Describes parts of the body using simple phrases.",
            "EFL.2.2.p.40. Names places where the body is cared for.",
          ],
          actitudinales: [
            "EFL.2.4.a.13. Cares for their own body during learning activities.",
            "EFL.2.4.a.14. Recognizes family members who support care of the body.",
            "EFL.2.4.a.15. Values knowledge about the body and healthy habits.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.10. Words and expressions about foods, animals, plants, and everyday objects from the local environment.",
            "EFL.2.1.d.21. Numbers, colors, shapes, sizes, and quantities used in everyday situations.",
            "EFL.2.1.d.9. Words and expressions about the body, its parts, and basic states of well-being.",
            "EFL.2.1.d.33. Everyday ways of moving, resting, playing, and caring for the body.",
          ],
          procedimentales: [
            "EFL.2.3.p.24. Associates written language, images, and oral language to support meaning.",
            "EFL.2.4.p.25. Writes and copies familiar words and short phrases with visual support and basic decoding.",
            "EFL.2.4.p.26. Draws and labels objects, beings, and places of the environment, connecting images with written words.",
            "EFL.2.1.p.34. Uses images, gestures, and sounds as supports for understanding English.",
            "EFL.2.2.p.38. Uses simple memory strategies such as drawing, play, singing, and repetition to remember vocabulary.",
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, animals, and places from the environment.",
            "EFL.2.4.p.29. Completes simple lists, cards, and forms with known vocabulary.",
            "EFL.2.2.p.42. Describes plants, animals, foods, and tools from the environment using simple phrases.",
            "EFL.2.2.p.39. Describes parts of the body and basic ways to care for them using simple phrases.",
            "EFL.2.2.p.40. Names moments and places where the body is cared for.",
          ],
          actitudinales: [
            "EFL.2.4.a.13. Cares for their own body and respects classmates during learning activities.",
            "EFL.2.4.a.14. Recognizes family and community members who support care of the body.",
            "EFL.2.4.a.15. Values knowledge about the body, movement, and healthy habits.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.10. Words and expressions about foods, animals, plants, and everyday objects from the local environment.",
            "EFL.2.1.d.21. Numbers, colors, shapes, sizes, and quantities used in everyday situations.",
            "EFL.2.1.d.9. Words and expressions about the body, its parts, and basic states of well-being.",
            "EFL.2.1.d.33. Everyday ways of moving, resting, playing, and caring for the body.",
          ],
          procedimentales: [
            "EFL.2.3.p.24. Associates written language, images, and oral language to support meaning.",
            "EFL.2.4.p.25. Writes and copies familiar words and short phrases with visual support and basic decoding.",
            "EFL.2.4.p.26. Draws and labels objects, beings, and places of the environment, connecting images with written words.",
            "EFL.2.1.p.34. Uses images, gestures, and sounds as supports for understanding English.",
            "EFL.2.2.p.38. Uses simple memory strategies such as drawing, play, singing, and repetition to remember vocabulary.",
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, animals, and places from the environment.",
            "EFL.2.4.p.29. Completes simple lists, cards and forms with known vocabulary.",
            "EFL.2.2.p.42. Describes plants, animals, foods, and tools from the environment using simple phrases.",
            "EFL.2.2.p.39. Describes parts of the body and basic ways to care for them using simple phrases.",
            "EFL.2.2.p.40. Names moments and places where the body is cared for.",
          ],
          actitudinales: [
            "EFL.2.4.a.13. Cares for their own body and respects classmates during learning activities.",
            "EFL.2.4.a.14. Recognizes family and community members who support care of the body.",
            "EFL.2.4.a.15. Values knowledge about the body, movement, and healthy habits.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.2.24",
    descripcion: "Recognition of the natural world of our territory, through short texts and images, to name and compare rivers, mountains, forests, animals and plants of Ecuador and the Americas — promoting their care as a condition of inhabiting",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.10. Words and expressions about foods, animals, and everyday objects from the local environment.",
            "EFL.2.1.d.13. Words and expressions about nearby animals, plants, and natural places.",
            "EFL.2.1.d.21. Everyday situations. Numbers, colors, shapes, and basic sizes used in everyday situations.",
            "EFL.2.1.d.35. Plants and animals of Ecuador.",
          ],
          procedimentales: [
            "EFL.2.2.p.6. Names familiar people, objects, and places in the immediate environment.",
            "EFL.2.4.p.26. Draws and labels familiar objects and beings from the immediate environment, connecting images with written words.",
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, and animals from the immediate environment.",
            "EFL.2.2.p.42. Describes plants, animals, and foods from the environment using simple phrases.",
            "EFL.2.2.p.43. Compares elements of Ecuador's natural environment using simple phrases.",
          ],
          actitudinales: [
            "EFL.2.4.a.20. Cares for living beings and places named in classroom activities.",
            "EFL.2.4.a.21. Recognizes the natural world of Ecuador as a shared environment.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.10. Words and expressions about foods, animals, plants, and everyday objects from the local environment.",
            "EFL.2.1.d.13. Words and expressions about the nearby natural world: rivers, mountains, forests, animals, and plants.",
            "EFL.2.1.d.21. Numbers, colors, shapes, sizes, and quantities used in everyday situations.",
            "EFL.2.1.d.35. Plants, animals, rivers, mountains, and forests of Ecuador.",
          ],
          procedimentales: [
            "EFL.2.2.p.6. Names places, people, objects, and living beings in the surrounding environment. Draws and labels objects, beings, and places of the environment, connecting images with written words.",
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, animals, and places from the environment.",
            "EFL.2.2.p.42. Describes plants, animals, foods, and tools from the environment using simple phrases.",
            "EFL.2.2.p.43. Compares elements of Ecuador's natural environment with those of the Americas using simple phrases.",
          ],
          actitudinales: [
            "EFL.2.4.a.20. Cares for living beings and places named in classroom activities, showing respect and responsibility.",
            "EFL.2.4.a.21. Recognizes the natural world of Ecuador and the Americas as a shared environment.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.2.1.d.10. Words and expressions about foods, animals, plants, and everyday objects from the local environment.",
            "EFL.2.1.d.13. Words and expressions about the nearby natural world: rivers, mountains, forests, animals, and plants.",
            "EFL.2.1.d.21. Numbers, colors, shapes, sizes, and quantities used in everyday situations.",
            "EFL.2.1.d.35. Plants, animals, rivers, mountains, and forests of Ecuador and the Americas.",
          ],
          procedimentales: [
            "EFL.2.4.p.26. Draws and labels objects, beings, and places of the environment, connecting images with written words.",
            "EFL.2.2.p.10. Describes orally, using simple phrases, images, objects, people, animals, and places from the environment.",
            "EFL.2.2.p.42. Describes plants, animals, foods, and tools from the environment using simple phrases.",
            "EFL.2.2.p.43. Compares elements of Ecuador's natural environment with those of the Americas using simple phrases.",
          ],
          actitudinales: [
            "EFL.2.4.a.20. Cares for living beings and places named in classroom activities, showing respect and responsibility.",
            "EFL.2.4.a.21. Recognizes the natural world of Ecuador and the Americas as a shared environment and common home.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.1",
    descripcion: "Using simple narratives and basic descriptions to playfully describe daily activities and games, communicating what is done, with whom, where, and when, and recognizing play as shared knowledge transmitted across generations",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; and familiar pronunciation patterns encountered in everyday communication.",
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community.",
            "EFL.3.4.d.15. Simple past with regular verbs and was/were in affirmative sentences.",
            "EFL.3.4.d.19. Present continuous for actions happening now.",
          ],
          procedimentales: [
            "EFL.3.2.p.5. Describes daily activities and routines using simple sentences in the present tense.",
          ],
          actitudinales: [
            "EFL.3.1.a.1. Shows curiosity about different ways of saying and naming things in English and other languages in familiar classroom situations.",
            "EFL.3.2.a.3. Is willing to participate in English learning activities, recognizing errors as part of the learning process.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community. Simple past with regular and high-frequency irregular verbs in affirmative and negative forms to recount events and experiences.",
            "EFL.3.4.d.19. Present continuous for ongoing actions and simple planned actions.",
          ],
          procedimentales: [
            "EFL.3.2.p.5. Narrates daily activities, games, and routines using connected sentences with basic sequence connectors and present or simple past forms.",
          ],
          actitudinales: [
            "EFL.3.2.a.3. Is willing to speak, read, and write in English, treating errors as a natural part of learning.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.4.d.15. Simple past for narration: regular and high-frequency irregular verbs (was/were, went, had, said, made, came), affirmative, negative, and question forms used to recount events and experiences.",
            "EFL.3.4.d.19. Present continuous for ongoing and planned actions: use for what is happening right now and for near-future arrangements (We are meeting tomorrow).",
          ],
          procedimentales: [
            "EFL.3.2.p.5. Narrates daily activities, games, and routines using connected sentences with basic sequence connectors and simple past or present tense forms.",
          ],
          actitudinales: [
            "EFL.3.2.a.3. Is willing to speak, read, and write in English throughout the school year, treating errors as a natural part of learning.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.2",
    descripcion: "Actively and attentively listening to recorded news and announcements about the school, community, and local environment to identify main ideas and key details and to understand different perspectives on everyday events, recognizing multiple voices and ways of telling",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.16. Future with going to for simple plans and intentions.",
            "EFL.3.1.d.28. Sustained listening for specific information: strategies for attending to short recordings to identify the main idea.",
          ],
          procedimentales: [
            "EFL.3.1.p.1. Identifies who, what, and where in short recorded news, announcements, and informational videos about the school and community.",
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to the stories and opinions of classmates and family members in English and in the languages of the place.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.16. Future with will for announcements and spontaneous decisions, and be going to for plans.",
            "EFL.3.1.d.28. Sustained listening for specific information: strategies for attending to short recordings — such as news, announcements, short videos, and interviews — to identify main ideas and key details.",
          ],
          procedimentales: [
            "EFL.3.1.p.1. Identifies the main idea and key details (who, what, where, when) in short recorded news, announcements, and informational videos about the school and the community.",
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to stories, opinions, and recommendations of classmates, family members, and community members in English and in the languages of the place.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.16. Future with will and be going to: use of will for announcements and spontaneous decisions and be going to for plans and intentions in short texts and oral exchanges.",
            "EFL.3.1.d.28. Sustained listening for specific information: strategies for attending to short recordings — such as news, announcements, short videos, and interviews — to identify main ideas, key details, and the speaker's purpose.",
          ],
          procedimentales: [
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to the stories, opinions, and recommendations of classmates, family members, and community members, in English and in the languages of the place.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.3",
    descripcion: "Understanding everyday transactions and exchanges in the community through dialogues to participate in social interactions and to describe how goods, services, and support are exchanged, recognizing both community-based and monetary forms of exchange",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.2.d.7. Vocabulary for community and neighborhood places: stores, markets, parks, libraries, and transport stops.",
            "EFL.3.4.d.18. Modals can and must to express ability and obligation in everyday situations.",
            "EFL.3.2.d.27. Short oral interactions of everyday life: asking, offering, thanking, and apologizing using familiar formulas.",
          ],
          procedimentales: [
            "EFL.3.2.p.10. Participates in simple everyday exchanges by asking and answering questions and using familiar expressions.",
            "EFL.3.1.p.41. Asks for repetition when something is not understood.",
          ],
          actitudinales: [
            "EFL.3.1.a.8. Respects turn-taking and the time of whoever is speaking in classroom exchanges and simple discussions.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.2.d.7. Vocabulary for community and neighborhood places: stores, markets, fairs, parks, clinics, libraries, transport stops, and everyday services.",
            "EFL.3.4.d.18. Modals can, could, should, and must for ability, possibility, advice, and obligation in guided contexts.",
            "EFL.3.2.d.27. Short oral interactions of everyday life: buying, asking, offering, inviting, thanking, and apologizing using familiar formulas.",
          ],
          procedimentales: [
            "EFL.3.2.p.10. Participates in everyday transactions and exchanges: asks questions, responds, makes requests, offers help, and thanks others using familiar formulas.",
            "EFL.3.1.p.41. Asks for clarification, repetition, or an example when something is not understood.",
          ],
          actitudinales: [
            "EFL.3.1.a.8. Respects turn-taking and the time of whoever is speaking in exchanges, interviews, and class discussions.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.2.d.7. Vocabulary for community and neighborhood places: stores, markets, fairs, parks, clinics, libraries, transport stops, and services used in everyday life.",
            "EFL.3.4.d.18. Modals can, could, should, and must for ability, possibility, advice, and obligation: receptive and guided productive use in everyday transactions, guides, infographics, and agreements.",
            "EFL.3.2.d.27. Short oral interactions of everyday life: transactional and interactional exchanges in community settings — buying, asking, offering, inviting, thanking, apologizing — using familiar formulas and basic modals.",
          ],
          procedimentales: [
            "EFL.3.2.p.10. Participates in everyday transactions and exchanges: ask questions, respond, make requests, offer help, and thank others using basic modals and familiar formulas.",
            "EFL.3.1.p.41. Asks for clarification, repetition, or an example when something is not understood.",
          ],
          actitudinales: [
            "EFL.3.1.a.8. Respects turn-taking and the time of whoever is speaking in exchanges, interviews, and class discussions.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.4",
    descripcion: "Recording and organizing information from short informational videos using written outlines to identify, structure, and share learning about the community, the natural world, and other contexts, recognizing videos as one of multiple sources of information",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including illustrated messages, announcements, invitations, and short narratives used in school and community contexts.",
            "EFL.3.4.d.9. Vocabulary for weather and seasons.",
            "EFL.3.4.d.20. Sentence connectors of sequence: first, then, after, before, finally.",
            "EFL.3.4.d.23. Informational texts such as guides and infographics with headings and images.",
            "EFL.3.1.d.28. Sustained listening for specific information: strategies for attending to short recordings to identify the main idea.",
          ],
          procedimentales: [
            "EFL.3.1.p.1. Identifies who, what, and where in short recorded news, announcements, and informational videos about the school and community.",
            "EFL.3.1.p.3. Follows short sequenced instructions to complete classroom activities and games.",
            "EFL.3.3.p.21. Locates explicit information in short texts used in the classroom.",
            "EFL.3.4.p.23. Drafts simple written outlines from short informational videos using titles and key words.",
            "EFL.3.3.p.40. Uses illustrated dictionaries with teacher support to expand vocabulary.",
          ],
          actitudinales: [
            "EFL.3.1.a.23. Shares with confidence what is being learned in classroom activities with support.",
            "EFL.3.3.a.24. Practices responsible digital behavior by asking permission before sharing information in classroom contexts.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including short narratives, announcements, blog posts, illustrated messages, infographics, invitations, and guides used in school and community contexts.",
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), basic comma use, common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds and word stress.",
            "EFL.3.4.d.9. Vocabulary for weather, seasons, and the natural environment: climate, landscapes, plants, and animals.",
            "EFL.3.4.d.20. Sentence connectors of sequence and cause: first, then, after, before, finally; because, so.",
            "EFL.3.4.d.23. Informational texts (guides, infographics, questionnaires) using numbered steps, headings, icons, and visual cues.",
            "EFL.3.1.d.28. Sustained listening for specific information: strategies for attending to short recordings — such as news, announcements, short videos, and interviews — to identify main ideas and key details.",
          ],
          procedimentales: [
            "EFL.3.1.p.1. Identifies the main idea and key details (who, what, where, when) in short recorded news, announcements, and informational videos about the school and the community.",
            "EFL.3.1.p.3. Follows sequenced instructions in short videos to complete tasks, games, and classroom activities.",
            "EFL.3.3.p.21. Locates explicit information and infers simple implied information in short texts used in the classroom with support.",
            "EFL.3.4.p.23. Drafts simple written outlines from short informational videos using titles, key words, and short sentences.",
            "EFL.3.3.p.40. Uses illustrated dictionaries and simple digital tools with teacher support to expand vocabulary.",
          ],
          actitudinales: [
            "EFL.3.1.a.23. Shares with confidence what is being learned and the questions that arise during classroom activities.",
            "EFL.3.3.a.24. Practices responsible digital behavior by asking permission before sharing and respecting information used in classroom and online contexts.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including short narratives, announcements, blog posts, illustrated messages, infographics, invitations, guides, and basic agreements used in school and community contexts.",
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), basic comma use, common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds, word stress, and simple intonation patterns.",
            "EFL.3.4.d.9. Vocabulary for weather, seasons, and the natural environment: climate, landscapes, ecosystems, plants, and animals of the place and other regions.",
            "EFL.3.4.d.20. Sentence connectors of sequence, contrast, and cause: first, then, after, before, finally (sequence); however, although (contrast); because, so (cause/result), used in narratives and explanations.",
            "EFL.3.4.d.23. Informational texts (guides, infographics, questionnaires): short factual texts that explain, instruct, or present data using numbered steps, headings, icons, and visual cues.",
            "EFL.3.1.d.28. Sustained listening for specific information: strategies for attending to short recordings — such as news, announcements, short videos, and interviews — to identify main ideas, key details, and the speaker's purpose.",
          ],
          procedimentales: [
            "EFL.3.1.p.1. Identifies the main idea and key details (who, what, where, when) in short, recorded news, announcements, and informational videos about the school, the community, and the natural world.",
            "EFL.3.1.p.3. Follows sequenced instructions in short videos to complete tasks, play games, and participate in classroom activities.",
            "EFL.3.3.p.21. Locates explicit information and begin to infer simple implied information in short texts used in the classroom.",
            "EFL.3.4.p.23. Drafts simple written outlines from short informational videos, using titles, key words, and short sentences to organize and share what has been learned.",
            "EFL.3.3.p.40. Uses illustrated dictionaries and simple digital tools with teacher support to expand vocabulary.",
          ],
          actitudinales: [
            "EFL.3.1.a.23. Shares with confidence what is being learned, the questions that arise, and the discoveries made in classroom activities.",
            "EFL.3.3.a.24. Is committed to responsible digital behavior: asks permission before sharing, cites sources, and respects what circulates in the classroom and online.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.5",
    descripcion: "Recognizing technological devices used at home, at school, and in the community through basic conversations in English and learners’ languages to identify device names, functions, and care practices, recognizing technology as a tool for learning and daily life",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; and familiar pronunciation patterns encountered in everyday communication.",
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds.",
            "EFL.3.4.d.12. Vocabulary for technology and digital devices: names of common devices and their basic functions.",
            "EFL.3.4.d.18. Modals can and must to express ability and obligation in everyday situations.",
            "EFL.3.4.d.21. Question forms using Wh- questions and yes/no questions.",
            "EFL.3.2.d.27. Short oral interactions of everyday life: asking, offering, thanking, and apologizing using familiar formulas.",
          ],
          procedimentales: [
            "EFL.3.2.p.10. Participates in simple everyday exchanges by asking and answering questions and using familiar expressions.",
            "EFL.3.1.p.41. Asks for repetition when something is not understood.",
            "EFL.3.2.p.13. Names familiar technological devices and describes their basic use.",
          ],
          actitudinales: [
            "EFL.3.2.a.9. Asks for help when needed during classroom activities.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.4.d.12. Vocabulary for technology and digital devices: device names, parts, functions, and care practices used at home and at school.",
            "EFL.3.4.d.18. Modals can, could, should, and must for ability, possibility, advice, and obligation in guided contexts.",
            "EFL.3.4.d.21. Question forms including how often, how long, and how much/many.",
            "EFL.3.2.d.27. Short oral interactions of everyday life: buying, asking, offering, inviting, thanking, and apologizing using familiar formulas.",
          ],
          procedimentales: [
            "EFL.3.2.p.10. Participates in everyday transactions and exchanges: asks questions, responds, makes requests, offers help, and thanks others using familiar formulas.",
            "EFL.3.1.p.41. Asks for clarification, repetition, or an example when something is not understood.",
            "EFL.3.2.p.13. Describes technological devices, explains their use, and asks for simple help when needed.",
          ],
          actitudinales: [
            "EFL.3.2.a.9. Asks for help when needed and offers help to classmates when possible.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.4.d.12. Vocabulary for technology and digital devices: device names, parts, functions, and care practices used at home, at school, and in the community.",
            "EFL.3.4.d.18. Modals can, could, should, and must for ability, possibility, advice, and obligation: receptive and guided productive use in everyday transactions, guides, infographics, and agreements.",
            "EFL.3.4.d.21. Question forms including how often, how long, and how much/many: Wh- questions, yes/no questions, and basic indirect question structures (Can you tell me...?) used in interviews, inquiries, and conversations.",
            "EFL.3.2.d.27. Short oral interactions of everyday life: transactional and interactional exchanges in community settings — buying, asking, offering, inviting, thanking, apologizing — using familiar formulas and basic modals.",
          ],
          procedimentales: [
            "EFL.3.2.p.10. Participates in everyday transactions and exchanges: ask questions, respond, make requests, offer help, and thank others using basic modals and familiar formulas.",
            "EFL.3.1.p.41. Asks for clarification, repetition, or an example when something is not understood.",
            "EFL.3.2.p.13. Sustains short conversations about technological devices: name them, describe their use, and ask for help to solve a simple difficulty.",
          ],
          actitudinales: [
            "EFL.3.2.a.9. Asks for help when needed and offers it when possible.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.6",
    descripcion: "Collaborating to organize classroom and community events by issuing invitations in English and learners’ languages to agree on roles, time, and place, promoting shared responsibility and participation in community life",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; and familiar pronunciation patterns encountered in everyday communication.",
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community.",
            "EFL.3.4.d.13. Vocabulary for food preparation: ingredients and basic cooking actions.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: celebrations, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.16. Future with going to for simple plans and intentions.",
            "EFL.3.4.d.19. Present continuous for actions happening now.",
            "EFL.3.4.d.26. Functional texts such as invitations, notices, and warnings used in school.",
            "EFL.3.2.d.27. Short oral interactions of everyday life: asking, offering, thanking, and apologizing using familiar formulas.",
          ],
          procedimentales: [
            "EFL.3.2.p.6. Describes places, people, and objects using simple words and short descriptive sentences.",
            "EFL.3.2.p.11. Invites classmates to simple classroom activities using familiar expressions.",
            "EFL.3.4.p.36. Uses words from the community language within English sentences to name familiar objects and places.",
            "EFL.3.3.p.42. Notices similarities between English and the languages known to support comprehension.",
            "EFL.3.4.p.47. Plans a classroom task with classmates by identifying materials and simple responsibilities.",
          ],
          actitudinales: [
            "EFL.3.2.a.2. Accepts English as one of many languages used to communicate and learn about the world.",
            "EFL.3.2.a.4. Values the languages of Ecuador and the local community as part of classroom interactions.",
            "EFL.3.1.a.5. Respects people who speak different languages and appreciates words from local languages when they appear in the classroom.",
            "EFL.3.2.a.22. Cooperates with classmates in shared classroom tasks.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community. Vocabulary for food preparation and community practices: ingredients, cooking actions, and names of shared dishes.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: gatherings, celebrations, agreements, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.16. Future with will for announcements and spontaneous decisions, and be going to for plans.",
            "EFL.3.4.d.19. Present continuous for ongoing actions and simple planned actions.",
            "EFL.3.4.d.26. Functional texts (invitations, warnings, agreements, school notices) that organize shared school and community life.",
            "EFL.3.2.d.27. Short oral interactions of everyday life: buying, asking, offering, inviting, thanking, and apologizing using familiar formulas.",
          ],
          procedimentales: [
            "EFL.3.2.p.6. Describes places, people, objects, and community practices using concrete details.",
            "EFL.3.2.p.11. Invites and agrees with classmates on tasks and gatherings using basic future forms.",
            "EFL.3.4.p.36. Uses words from other known languages within English sentences as cultural bridges.",
            "EFL.3.3.p.42. Notices similarities and differences between English and the languages known to support comprehension.",
            "EFL.3.4.p.47. Plans a task or celebration with classmates by organizing roles, materials, and simple timelines.",
          ],
          actitudinales: [
            "EFL.3.2.a.2. Accepts English as one of many languages, equally valid for communicating and learning about different people and contexts.",
            "EFL.3.2.a.4. Values the languages of Ecuador and the local community as part of the classroom's shared repertoire.",
            "EFL.3.1.a.5. Respects people who speak different languages and appreciates the presence of local languages in classroom interactions.",
            "EFL.3.2.a.22. Cooperates with classmates in shared tasks and projects, contributing to collective efforts.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.4.d.13. Vocabulary for food preparation and community practices: ingredients, cooking actions, names of shared dishes, and practices of preparing and sharing food.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: gatherings, celebrations, agreements, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.16. Future with will and be going to: use of will for announcements and spontaneous decisions and be going to for plans and intentions in short texts and oral exchanges.",
            "EFL.3.4.d.19. Present continuous for ongoing and planned actions: use for what is happening right now and for near-future arrangements (We are meeting tomorrow).",
            "EFL.3.4.d.26. Functional texts (invitations, warnings, agreements, school notices): short purposeful texts that organize shared life, set expectations, and communicate rights and responsibilities in the school and community.",
            "EFL.3.2.d.27. Short oral interactions of everyday life: transactional and interactional exchanges in community settings — buying, asking, offering, inviting, thanking, apologizing — using familiar formulas and basic modals.",
          ],
          procedimentales: [
            "EFL.3.2.p.6. Describes places, people, objects, and community practices using concrete details and simple comparisons.",
            "EFL.3.2.p.11. Invites and agrees with classmates on tasks, gatherings, and celebrations using basic future forms and sequence connectors.",
            "EFL.3.4.p.36. Uses words from other languages known within English sentences as cultural bridges, and name objects, practices, and places in both English and the community language.",
            "EFL.3.3.p.42. Notices similarities and differences between English and the languages known to support comprehension and production.",
            "EFL.3.4.p.47. Plans a task, celebration, or school project with classmates by distributing roles, materials, and timelines.",
          ],
          actitudinales: [
            "EFL.3.2.a.2. Accepts English as one of many languages, equally valid for understanding the world and meeting new people.",
            "EFL.3.2.a.4. Values the languages of Ecuador and the local community as part of the classroom's shared repertoire.",
            "EFL.3.1.a.5. Respects people who speak different languages and appreciates words from local languages when they appear in the classroom.",
            "EFL.3.2.a.22. Cooperates with classmates in shared tasks and projects, sustaining the collective effort from beginning to end.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.7",
    descripcion: "Explaining common community practices through simple oral presentations that describe how and why they are carried out, recognizing community members as bearers of living knowledge",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.13. Vocabulary for food preparation: ingredients and basic cooking actions.",
            "EFL.3.4.d.20. Sentence connectors of sequence: first, then, after, before, finally.",
            "EFL.3.3.d.22. Short narratives: personal stories and simple event recounts with a clear beginning, middle, and end.",
            "EFL.3.4.d.31. Presentation of information using simple images or diagrams.",
            "EFL.3.4.d.32. Shared community practices: games, celebrations, songs, and food traditions.",
          ],
          procedimentales: [
            "EFL.3.2.p.6. Describes places, people, and objects using simple words and short descriptive sentences.",
            "EFL.3.2.p.48. Participates in simple group productions and shares what was learned.",
          ],
          actitudinales: [
            "EFL.3.2.a.3. Is willing to participate in English learning activities, recognizing errors as part of the learning process.",
            "EFL.3.1.a.15. Enjoys and values the community's stories, rhymes, games, and celebrations as expressions of shared experiences.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.13. Vocabulary for food preparation and community practices: ingredients, cooking actions, and names of shared dishes.",
            "EFL.3.4.d.20. Sentence connectors of sequence and cause: first, then, after, before, finally; because, so.",
            "EFL.3.3.d.22. Short narratives and chronicles: personal stories, event recounts, community chronicles, and travel accounts with a clear beginning, middle, and end.",
            "EFL.3.4.d.31. Presentation of information combining spoken or written text with visual support.",
            "EFL.3.4.d.32. Shared practices passed down across generations, including crafts and ways of caring.",
          ],
          procedimentales: [
            "EFL.3.2.p.6. Describes places, people, objects, and community practices using concrete details.",
            "EFL.3.2.p.48. Cooperates with others in collective productions and shares orally what has been learned.",
          ],
          actitudinales: [
            "EFL.3.2.a.3. Is willing to speak, read, and write in English, treating errors as a natural part of learning.",
            "EFL.3.1.a.15. Enjoys and values the community's stories, rhymes, games, celebrations, and cultural practices as part of collective identity.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.13. Vocabulary for food preparation and community practices: ingredients, cooking actions, names of shared dishes, and practices of preparing and sharing food.",
            "EFL.3.4.d.20. Sentence connectors of sequence, contrast, and cause: first, then, after, before, finally (sequence); however, although (contrast); because, so (cause/result), used in narratives and explanations.",
            "EFL.3.3.d.22. Short narratives and chronicles: personal stories, event recounts, community chronicles, and travel accounts with a clear beginning, middle, and end.",
            "EFL.3.4.d.31. Presentation of information with visual support: strategies for combining spoken or written text with images, diagrams, and graphic organizers to share findings, recommendations, or project results with a familiar audience.",
            "EFL.3.4.d.32. Shared practices of the community passed down across generations: games, celebrations, food preparation, crafts, songs, and ways of caring that are transmitted within families and communities and recognized as living knowledge.",
          ],
          procedimentales: [
            "EFL.3.2.p.6. Describes places, people, objects, and community practices using concrete details and simple comparisons.",
            "EFL.3.2.p.48. Cooperates with others in collective productions and share orally what has been learned at the close of a stage or project.",
          ],
          actitudinales: [
            "EFL.3.2.a.3. Is willing to speak, read, and write in English throughout the school year, treating errors as a natural part of learning.",
            "EFL.3.1.a.15. Enjoys and values the community's stories, rhymes, games, celebrations, and shared cultural practices.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.8",
    descripcion: "Exploring personal and community experiences through short interviews with family, neighbors, and classmates, using basic questions to gather stories and memories while respecting individuals’ choices about what to share",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; and familiar pronunciation patterns encountered in everyday communication.",
            "EFL.3.2.d.10. Vocabulary for jobs, trades, and workplaces: names of occupations and common work settings.",
            "EFL.3.4.d.21. Question forms using Wh- questions and yes/no questions.",
            "EFL.3.3.d.22. Short narratives: personal stories and simple event recounts with a clear beginning, middle, and end.",
            "EFL.3.1.d.28. Sustained listening for specific information: strategies for attending to short recordings to identify the main idea.",
          ],
          procedimentales: [
            "EFL.3.2.p.7. Presents familiar community places or celebrations orally in English with visual support.",
            "EFL.3.2.p.9. Shares orally simple information learned from a reading or classroom activity.",
            "EFL.3.2.p.12. Asks and answers simple questions to gather personal information from classmates.",
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to the stories and opinions of classmates and family members in English and in the languages of the place.",
            "EFL.3.1.a.8. Respects turn-taking and the time of whoever is speaking in classroom exchanges and simple discussions.",
            "EFL.3.1.a.5. Respects people who speak different languages and appreciates words from local languages when they appear in the classroom.",
            "EFL.3.1.a.11. Respects what each person chooses to share in simple conversations and classroom interactions.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.2.d.10. Vocabulary for jobs, trades, and workplaces: names of occupations, tools, tasks, and work settings common to the community.",
            "EFL.3.4.d.21. Question forms including how often, how long, and how much/many.",
            "EFL.3.3.d.22. Short narratives and chronicles: personal stories, event recounts, community chronicles, and travel accounts with a clear beginning, middle, and end.",
            "EFL.3.1.d.28. Sustained listening for specific information: strategies for attending to short recordings — such as news, announcements, short videos, and interviews — to identify main ideas and key details.",
          ],
          procedimentales: [
            "EFL.3.2.p.7. Presents community practices, trades, and celebrations orally in English with visual support such as photographs, drawings, or objects.",
            "EFL.3.2.p.9. Shares orally what has been learned from an inquiry, a reading, or an interview, using short and clear statements.",
            "EFL.3.2.p.12. Conducts short interviews with classmates and family members by asking Wh- and yes/no questions.",
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to stories, opinions, and recommendations of classmates, family members, and community members in English and in the languages of the place.",
            "EFL.3.1.a.8. Respects turn-taking and the time of whoever is speaking in exchanges, interviews, and class discussions.",
            "EFL.3.1.a.5. Respects people who speak different languages and appreciates the presence of local languages in classroom interactions.",
            "EFL.3.1.a.11. Respects what each person chooses to share and what they prefer not to share in interviews and conversations.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.2.d.10. Vocabulary for jobs, trades, and workplaces: names of occupations, tools, tasks, and work settings common to the community.",
            "EFL.3.4.d.21. Question forms including how often, how long, and how much/many: Wh- questions, yes/no questions, and basic indirect question structures (Can you tell me...?) used in interviews, inquiries, and conversations.",
            "EFL.3.3.d.22. Short narratives and chronicles: personal stories, event recounts, community chronicles, and travel accounts with a clear beginning, middle, and end.",
            "EFL.3.1.d.28. Sustained listening for specific information: strategies for attending to short recordings — such as news, announcements, short videos, and interviews — to identify main ideas, key details, and the speaker's purpose.",
          ],
          procedimentales: [
            "EFL.3.2.p.7. Presents community practices, trades, and celebrations orally in English with visual support such as photographs, drawings, or objects.",
            "EFL.3.2.p.9. Shares orally what has been learned from an inquiry, a reading, or an interview, using short and clear statements.",
            "EFL.3.2.p.12. Conducts short interviews with family members, neighbors, and classmates by formulating Wh- and yes/no questions and recording their answers.",
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to the stories, opinions, and recommendations of classmates, family members, and community members, in English and in the languages of the place.",
            "EFL.3.1.a.8. Respects turn-taking and the time of whoever is speaking in exchanges, interviews, and class discussions.",
            "EFL.3.1.a.5. Respects people who speak different languages and appreciates words from local languages when they appear in the classroom.",
            "EFL.3.1.a.11. Respects what each person chooses to share and what they prefer not to share in interviews and conversations.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.9",
    descripcion: "Engaging in intercultural reading of literary texts, such as stories, rhymes, and poems created by children and communities in different contexts, to identify similarities and differences in experiences, traditions, and ways of life, fostering openness to intercultural understanding",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.2. Awareness that English is spoken by people in different places and communities with different voices and accents.",
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community.",
            "EFL.3.3.d.24. Short literary texts (rhymes, short stories, riddles): creative and playful texts, including illustrated stories and riddles.",
            "EFL.3.3.d.29. Strategies for reading English texts with support from visual elements and familiar languages.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, and celebrations that reflect different ways of life.",
          ],
          procedimentales: [
            "EFL.3.1.p.2. Recognizes that different people may speak English in different ways.",
            "EFL.3.3.p.16. Reads illustrated stories, rhymes, and poems from communities that learn or use English, identifying main ideas and key images.",
            "EFL.3.3.p.22. Recognizes the opening and closing of narrative and informational texts.",
            "EFL.3.4.p.36. Uses words from the community language within English sentences to name familiar objects and places.",
            "EFL.3.1.p.39. Practices the pronunciation of new English words by listening to the teacher or classmates.",
          ],
          actitudinales: [
            "EFL.3.1.a.1. Shows curiosity about different ways of saying and naming things in English and other languages in familiar classroom situations.",
            "EFL.3.1.a.5. Respects people who speak different languages and appreciates words from local languages when they appear in the classroom.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.2. Awareness of common varieties of English found in the region and around the world, including different voices, accents, and intonation patterns.",
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community. Short literary texts (rhymes, short stories, riddles): creative, playful texts from communities that learn or use English in different places, including illustrated stories and riddles that invite language play.",
            "EFL.3.3.d.29. Intercultural reading with mediation between languages: strategies for reading English texts with support from community languages and visual elements.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, celebrations, and ways of life that show the diversity of English-speaking communities worldwide.",
          ],
          procedimentales: [
            "EFL.3.1.p.2. Distinguishes different voices and accents in recordings from communities that learn or use English in different places.",
            "EFL.3.3.p.16. Reads illustrated stories, rhymes, and poems from communities that learn or use English in different places, identifying main ideas, key images, and simple messages.",
            "EFL.3.3.p.22. Recognizes the basic structure of narrative and informational texts: opening, development, and closing.",
            "EFL.3.4.p.36. Uses words from other known languages within English sentences as cultural bridges.",
            "EFL.3.1.p.39. Practices the pronunciation of new words and phrases using oral models such as recordings, videos, the teacher, or classmates.",
          ],
          actitudinales: [
            "EFL.3.1.a.1. Shows curiosity about similarities and differences in the ways of saying, telling, and naming things in English and other languages.",
            "EFL.3.1.a.5. Respects people who speak different languages and appreciates the presence of local languages in classroom interactions.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.2. Awareness of common varieties of English found in the region and around the world, including different voices, accents, intonation patterns, and regional expressions.",
            "EFL.3.3.d.24. Short literary texts (rhymes, short stories, riddles): creative, playful texts from communities that learn or use English in different places, including illustrated stories and riddles that invite language play.",
            "EFL.3.3.d.29. Intercultural reading with mediation between languages: strategies for reading English texts with support from community languages and visual elements, and for translating meaning between English and the languages of the place.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, celebrations, and ways of life that show the diversity of English-speaking communities worldwide.",
          ],
          procedimentales: [
            "EFL.3.4.p.36. Uses words from other languages known within English sentences as cultural bridges, and name objects, practices, and places in both English and the community language.",
            "EFL.3.1.p.2. Distinguishes different voices, accents, and ways of telling in recordings from communities that learn or use English in different places.",
            "EFL.3.3.p.16. Reads illustrated stories, rhymes, and poems from communities that learn or use English in different places, identifying main ideas and key images.",
            "EFL.3.3.p.22. Recognizes the basic structure of narrative and informational texts: opening, development, and closing.",
            "EFL.3.1.p.39. Practices the pronunciation of new words and phrases by consulting oral models such as audio recordings, videos, the teacher, or a classmate.",
          ],
          actitudinales: [
            "EFL.3.1.a.1. Shows curiosity about the ways of saying, telling, and naming things in English and in other languages.",
            "EFL.3.1.a.5. Respects people who speak different languages and appreciates words from local languages when they appear in the classroom.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.10",
    descripcion: "Dramatizing short literary texts through simple dialogues, gestures, and visual support to retell stories from different communities, recognizing the emotions and experiences expressed in the narratives",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.24. Short literary texts (rhymes, short stories, riddles): creative and playful texts, including illustrated stories and riddles.",
            "EFL.3.4.d.32. Shared community practices: games, celebrations, songs, and food traditions.",
          ],
          procedimentales: [
            "EFL.3.1.p.4. Recognizes basic emotions in short dialogues and stories.",
            "EFL.3.2.p.8. Recites rhymes, riddles, and short dialogues with teacher support.",
            "EFL.3.1.p.39. Practices the pronunciation of new English words by listening to the teacher or classmates.",
          ],
          actitudinales: [
            "EFL.3.1.a.15. Enjoys and values the community's stories, rhymes, games, and celebrations as expressions of shared experiences.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.32. Shared practices passed down across generations, including crafts and ways of caring.",
            "EFL.3.3.d.24. Short literary texts (rhymes, short stories, riddles): creative, playful texts from communities that learn or use English in different places, including illustrated stories and riddles that invite language play.",
          ],
          procedimentales: [
            "EFL.3.1.p.4. Recognizes emotions and intentions in short dialogues, narratives, and role plays.",
            "EFL.3.2.p.8. Recites and dramatizes rhymes, riddles, short literary passages, and dialogues with appropriate intonation and expression.",
            "EFL.3.1.p.38. Uses images, gestures, sounds, and drawings to support comprehension and communication in English.",
            "EFL.3.1.p.39. Practices the pronunciation of new words and phrases using oral models such as recordings, videos, the teacher, or classmates.",
          ],
          actitudinales: [
            "EFL.3.1.a.15. Enjoys and values the community's stories, rhymes, games, celebrations, and cultural practices as part of collective identity.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.24. Short literary texts (rhymes, short stories, riddles): creative, playful texts from communities that learn or use English in different places, including illustrated stories and riddles that invite language play.",
            "EFL.3.4.d.32. Shared practices of the community passed down across generations: games, celebrations, food preparation, crafts, songs, and ways of caring that are transmitted within families and communities and recognized as living knowledge.",
          ],
          procedimentales: [
            "EFL.3.1.p.4. Recognizes emotions, intentions, and purposes in short dialogues, narratives, and theatrical reenactments.",
            "EFL.3.2.p.8. Recites and dramatize rhymes, riddles, short literary passages, and dialogues with appropriate intonation and expression.",
            "EFL.3.1.p.38. Uses images, gestures, sounds, and drawings to support comprehension and production when English words alone are not enough.",
            "EFL.3.1.p.39. Practices the pronunciation of new words and phrases by consulting oral models such as audio recordings, videos, the teacher, or a classmate.",
          ],
          actitudinales: [
            "EFL.3.1.a.15. Enjoys and values the community's stories, rhymes, games, celebrations, and shared cultural practices.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.11",
    descripcion: "Identifying historical memories through stories, chronicles, and testimonies from the community, the country, and the world, comparing what has changed and what has remained, and understanding history as a set of multiple perspectives and voices",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.2. Awareness that English is spoken by people in different places and communities with different voices and accents.",
            "EFL.3.4.d.15. Simple past with regular verbs and was/were in affirmative sentences.",
            "EFL.3.4.d.17. Comparatives using regular forms to compare people, places, and objects.",
            "EFL.3.4.d.20. Sentence connectors of sequence: first, then, after, before, finally.",
            "EFL.3.3.d.22. Short narratives: personal stories and simple event recounts with a clear beginning, middle, and end.",
            "EFL.3.3.d.29. Strategies for reading English texts with support from visual elements and familiar languages.",
            "EFL.3.3.d.33. Cultural productions from the community and other places: stories, songs, dances, and visual arts as examples of diverse cultural expression.",
            "EFL.3.3.d.34. Historical memories and testimonies: photographs, objects, and simple oral accounts about important moments from the community.",
          ],
          procedimentales: [
            "EFL.3.1.p.1. Identifies who, what, and where in short recorded news, announcements, and informational videos about the school and community.",
            "EFL.3.1.p.2. Recognizes that different people may speak English in different ways.",
            "EFL.3.3.p.17. Reads short chronicles and testimonies to identify what has changed and what remains.",
            "EFL.3.3.p.22. Recognizes the opening and closing of narrative and informational texts.",
            "EFL.3.1.p.37. Shares simple information from another language in English with teacher support.",
          ],
          actitudinales: [
            "EFL.3.2.a.4. Values the languages of Ecuador and the local community as part of classroom interactions.",
            "EFL.3.3.a.16. Values stories and experiences from the place as knowledge shared by the community.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.2. Awareness of common varieties of English found in the region and around the world, including different voices, accents, and intonation patterns.",
            "EFL.3.4.d.15. Simple past with regular and high-frequency irregular verbs in affirmative and negative forms to recount events and experiences.",
            "EFL.3.4.d.17. Comparatives and common superlatives to compare people, places, objects, and practices.",
            "EFL.3.4.d.20. Sentence connectors of sequence and cause: first, then, after, before, finally; because, so.",
            "EFL.3.3.d.22. Short narratives and chronicles: personal stories, event recounts, community chronicles, and travel accounts with a clear beginning, middle, and end.",
            "EFL.3.3.d.29. Intercultural reading with mediation between languages: strategies for reading English texts with support from community languages and visual elements.",
            "EFL.3.3.d.33. Cultural productions from the community and other places: stories, songs, dances, visual arts, films, and crafts made by communities in Ecuador and other regions as examples of diverse aesthetic and expressive traditions.",
            "EFL.3.3.d.34. Historical memories and testimonies: chronicles, oral accounts, photographs, objects, and timelines that record important moments from the community and the country.",
          ],
          procedimentales: [
            "EFL.3.1.p.1. Identifies the main idea and key details (who, what, where, when) in short recorded news, announcements, and informational videos about the school and the community.",
            "EFL.3.1.p.2. Distinguishes different voices and accents in recordings from communities that learn or use English in different places.",
            "EFL.3.3.p.17. Reads short chronicles and testimonies to identify what has changed, what remains, and simple lessons from the past.",
            "EFL.3.3.p.22. Recognizes the basic structure of narrative and informational texts: opening, development, and closing.",
            "EFL.3.1.p.37. Summarizes orally or in writing simple information read or heard in another language in English.",
          ],
          actitudinales: [
            "EFL.3.2.a.4. Values the languages of Ecuador and the local community as part of the classroom's shared repertoire.",
            "EFL.3.3.a.16. Values the living memory of the place and the country as knowledge shared across generations.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.2. Awareness of common varieties of English found in the region and around the world, including different voices, accents, intonation patterns, and regional expressions.",
            "EFL.3.4.d.15. Simple past for narration: regular and high-frequency irregular verbs (was/were, went, had, said, made, came), affirmative, negative, and question forms used to recount events and experiences.",
            "EFL.3.4.d.17. Comparatives and superlatives: regular and common irregular forms (bigger, more important, the tallest, the most common) used to compare places, objects, people, and practices.",
            "EFL.3.4.d.20. Sentence connectors of sequence, contrast, and cause: first, then, after, before, finally (sequence); however, although (contrast); because, so (cause/result), used in narratives and explanations.",
            "EFL.3.3.d.22. Short narratives and chronicles: personal stories, event recounts, community chronicles, and travel accounts with a clear beginning, middle, and end.",
            "EFL.3.3.d.29. Intercultural reading with mediation between languages: strategies for reading English texts with support from community languages and visual elements, and for translating meaning between English and the languages of the place.",
            "EFL.3.3.d.33. Cultural productions from the community and other places: stories, songs, dances, visual arts, films, and crafts made by communities in Ecuador and in other regions as examples of diverse aesthetic and expressive traditions.",
          ],
          procedimentales: [
            "EFL.3.1.p.1. Identifies the main idea and key details (who, what, where, when) in short, recorded news, announcements, and informational videos about the school, the community, and the natural world.",
            "EFL.3.1.p.2. Distinguishes different voices, accents, and ways of telling in recordings from communities that learn or use English in different places.",
            "EFL.3.3.p.17. Reads short chronicles and testimonies to identify what has changed, what remains, and what can be learned from different memories of the past.",
            "EFL.3.3.p.22. Recognizes the basic structure of narrative and informational texts: opening, development, and closing.",
            "EFL.3.1.p.37. Summarizes, orally or in writing, the information read or heard in another language in English in the classroom.",
          ],
          actitudinales: [
            "EFL.3.2.a.4. Values the languages of Ecuador and the local community as part of the classroom's shared repertoire.",
            "EFL.3.3.a.16. Values the living memory of the place and the country as knowledge that is transmitted and cared for across generations.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.12",
    descripcion: "Understanding accounts of journeys and experiences across communities by reading, listening to, and retelling short texts in English and learners’ languages to expand knowledge of the world and recognize travel and migration as learning experiences",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.2. Awareness that English is spoken by people in different places and communities with different voices and accents.",
            "EFL.3.2.d.8. Vocabulary for transport and travel: means of transport, directions, and journeys.",
            "EFL.3.3.d.22. Short narratives: personal stories and simple event recounts with a clear beginning, middle, and end.",
            "EFL.3.4.d.35. The natural world: common landscapes, animals, and plants of the local environment.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, and celebrations that reflect different ways of life.",
          ],
          procedimentales: [
            "EFL.3.1.p.2. Recognizes that different people may speak English in different ways.",
            "EFL.3.3.p.18. Reads short accounts of journeys and experiences in different communities to identify places and events.",
            "EFL.3.4.p.45. Describes landscapes, climates, plants, and animals using short descriptive sentences.",
          ],
          actitudinales: [
            "EFL.3.1.a.1. Shows curiosity about different ways of saying and naming things in English and other languages in familiar classroom situations.",
            "EFL.3.4.a.20. Recognizes elements of the natural world of Ecuador as part of the environment that deserves care.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.2. Awareness of common varieties of English found in the region and around the world, including different voices, accents, and intonation patterns.",
            "EFL.3.2.d.8. Vocabulary for transport and travel: means of transport, directions, distances, and journeys.",
            "EFL.3.3.d.22. Short narratives and chronicles: personal stories, event recounts, community chronicles, and travel accounts with a clear beginning, middle, and end.",
            "EFL.3.4.d.35. The natural world of Ecuador: ecosystems, landscapes, animals, plants, and community care practices.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, celebrations, and ways of life that show the diversity of English-speaking communities worldwide.",
          ],
          procedimentales: [
            "EFL.3.1.p.2. Distinguishes different voices and accents in recordings from communities that learn or use English in different places.",
            "EFL.3.3.p.18. Reads short accounts of journeys and experiences in communities different from one's own to recognize similarities and differences.",
            "EFL.3.4.p.45. Compares landscapes, climates, plants, and animals using basic comparative forms.",
          ],
          actitudinales: [
            "EFL.3.4.a.20. Recognizes the natural world of Ecuador and the Americas as a shared environment that deserves attention and protection.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.2. Awareness of common varieties of English found in the region and around the world, including different voices, accents, intonation patterns, and regional expressions.",
            "EFL.3.2.d.8. Vocabulary for transport and travel: means of transport, directions, distances, journeys, and experiences of moving between places.",
            "EFL.3.3.d.22. Short narratives and chronicles: personal stories, event recounts, community chronicles, and travel accounts with a clear beginning, middle, and end.",
            "EFL.3.3.d.34. Historical memories and testimonies: chronicles, oral accounts, photographs, objects, and timelines that record important moments from the community, the country, and the world from the perspective of different voices.",
            "EFL.3.4.d.35. The natural world of the place and other regions: ecosystems, landscapes, animals, and plants of Ecuador and the Americas, and the practices communities use to care for and live with the natural world.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, celebrations, and ways of life that show the diversity of English-speaking communities worldwide.",
          ],
          procedimentales: [
            "EFL.3.1.p.2. Distinguishes different voices, accents, and ways of telling in recordings from communities that learn or use English in different places.",
            "EFL.3.3.p.18. Reads short accounts of journeys and experiences in communities different from one's own to broaden one's knowledge of the world.",
            "EFL.3.4.p.45. Compares the landscapes, climates, plants, and animals of Ecuador with those of other regions using short descriptive sentences and basic comparative forms.",
          ],
          actitudinales: [
            "EFL.3.4.a.20. Recognizes the natural world of Ecuador and the Americas as a shared home that deserves attention and protection.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.13",
    descripcion: "Sharing aspects of daily life through short, illustrated blog entries in English that describe experiences, feelings, and learning, and recognizing everyday life as meaningful and worth recording",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including illustrated messages, announcements, invitations, and short narratives used in school and community contexts.",
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds.",
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community.",
            "EFL.3.4.d.15. Simple past with regular verbs and was/were in affirmative sentences.",
            "EFL.3.4.d.25. Digital texts with images and headings that share everyday experiences.",
            "EFL.3.4.d.30. Collaborative writing: planning ideas and writing a first version with a partner.",
          ],
          procedimentales: [
            "EFL.3.2.p.5. Describes daily activities and routines using simple sentences in the present tense.",
            "EFL.3.3.p.19. Reads illustrated blog entries to identify aspects of the writer's daily life.",
            "EFL.3.4.p.24. Writes short, illustrated blog entries about everyday life.",
            "EFL.3.4.p.36. Uses words from the community language within English sentences to name familiar objects and places.",
            "EFL.3.3.p.42. Notices similarities between English and the languages known to support comprehension.",
          ],
          actitudinales: [
            "EFL.3.2.a.3. Is willing to participate in English learning activities, recognizing errors as part of the learning process.",
            "EFL.3.2.a.6. Recognizes the languages of the place as support for understanding English in familiar learning situations.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including short narratives, announcements, blog posts, illustrated messages, infographics, invitations, and guides used in school and community contexts.",
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), basic comma use, common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds and word stress.",
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community. Simple past with regular and high-frequency irregular verbs in affirmative and negative forms to recount events and experiences.",
            "EFL.3.4.d.25. Digital texts (blog entries, illustrated posts) that share experiences, opinions, or recommendations.",
            "EFL.3.4.d.30. Collaborative writing: planning, drafting, revising with short feedback, and preparing a final version.",
          ],
          procedimentales: [
            "EFL.3.2.p.5. Narrates daily activities, games, and routines using connected sentences with basic sequence connectors and present or simple past forms.",
            "EFL.3.3.p.19. Reads illustrated blog entries to recognize aspects of the writer's daily life and compare them with personal experiences.",
            "EFL.3.4.p.24. Writes short, illustrated blog entries in English and the community's languages about everyday life.",
            "EFL.3.4.p.36. Uses words from other known languages within English sentences as cultural bridges.",
            "EFL.3.3.p.42. Notices similarities and differences between English and the languages known to support comprehension.",
          ],
          actitudinales: [
            "EFL.3.2.a.3. Is willing to speak, read, and write in English, treating errors as a natural part of learning.",
            "EFL.3.2.a.6. Recognizes the languages of the place as a bridge for understanding English and expressing ideas.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including short narratives, announcements, blog posts, illustrated messages, infographics, invitations, guides, and basic agreements used in school and community contexts.",
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), basic comma use, common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds, word stress, and simple intonation patterns.",
            "EFL.3.4.d.15. Simple past for narration: regular and high-frequency irregular verbs (was/were, went, had, said, made, came), affirmative, negative, and question forms used to recount events and experiences.",
            "EFL.3.4.d.25. Digital texts (blog entries, illustrated posts): short written texts with images, headings, and hyperlinks that share everyday experiences, opinions, or recommendations for a school or community audience.",
            "EFL.3.4.d.30. Collaborative written production: stages and strategies for drafting, revising, and sharing texts in pairs and small groups — planning with notes, writing a first version, giving and receiving short feedback, and presenting a final product.",
          ],
          procedimentales: [
            "EFL.3.2.p.5. Narrates daily activities, games, and routines using connected sentences with basic sequence connectors and simple past or present tense forms.",
            "EFL.3.3.p.19. Reads illustrated blog entries to recognize aspects of the writer's daily life and connect them to one's own experience.",
            "EFL.3.4.p.24. Writes short, illustrated blog entries in English and the community's languages about everyday life in the places where the writer lives.",
            "EFL.3.4.p.36. Uses words from other languages known within English sentences as cultural bridges, and name objects, practices, and places in both English and the community language.",
            "EFL.3.3.p.42. Notices similarities and differences between English and the languages known to support comprehension and production.",
          ],
          actitudinales: [
            "EFL.3.2.a.3. Is willing to speak, read, and write in English throughout the school year, treating errors as a natural part of learning.",
            "EFL.3.2.a.6. Recognizes the languages of the place as a bridge for understanding English and for making oneself understood.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.14",
    descripcion: "Developing literary understanding through written responses to short texts, expressing what was surprising, meaningful, or memorable, and valuing multiple interpretations of literature",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including illustrated messages, announcements, invitations, and short narratives used in school and community contexts.",
            "EFL.3.4.d.17. Comparatives using regular forms to compare people, places, and objects.",
            "EFL.3.4.d.25. Digital texts with images and headings that share everyday experiences.",
          ],
          procedimentales: [
            "EFL.3.1.p.4. Recognizes basic emotions in short dialogues and stories.",
            "EFL.3.2.p.14. Expresses a simple opinion using familiar expressions.",
            "EFL.3.3.p.21. Locates explicit information in short texts used in the classroom.",
            "EFL.3.4.p.25. Writes short opinions about literary works, stating what they liked or found interesting.",
            "EFL.3.3.p.40. Uses illustrated dictionaries with teacher support to expand vocabulary.",
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to the stories and opinions of classmates and family members in English and in the languages of the place.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including short narratives, announcements, blog posts, illustrated messages, infographics, invitations, and guides used in school and community contexts.",
            "EFL.3.4.d.17. Comparatives and common superlatives to compare people, places, objects, and practices.",
            "EFL.3.4.d.25. Digital texts (blog entries, illustrated posts) that share experiences, opinions, or recommendations.",
          ],
          procedimentales: [
            "EFL.3.1.p.4. Recognizes emotions and intentions in short dialogues, narratives, and role plays.",
            "EFL.3.2.p.14. Expresses a simple opinion about a text, a practice, or a recommendation with a brief reason.",
            "EFL.3.3.p.21. Locates explicit information and infers simple implied information in short texts used in the classroom with support.",
            "EFL.3.4.p.25. Writes short opinions about literary works, stating what surprised them or what they remember most.",
            "EFL.3.3.p.40. Uses illustrated dictionaries and simple digital tools with teacher support to expand vocabulary.",
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to stories, opinions, and recommendations of classmates, family members, and community members in English and in the languages of the place.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including short narratives, announcements, blog posts, illustrated messages, infographics, invitations, guides, and basic agreements used in school and community contexts.",
            "EFL.3.4.d.17. Comparatives and superlatives: regular and common irregular forms (bigger, more important, the tallest, the most common) used to compare places, objects, people, and practices.",
            "EFL.3.4.d.25. Digital texts (blog entries, illustrated posts): short written texts with images, headings, and hyperlinks that share everyday experiences, opinions, or recommendations for a school or community audience.",
          ],
          procedimentales: [
            "EFL.3.1.p.4. Recognizes emotions, intentions, and purposes in short dialogues, narratives, and theatrical reenactments.",
            "EFL.3.2.p.14. Expresses a simple opinion about a text, a practice, or a recommendation, giving one brief reason.",
            "EFL.3.3.p.21. Locates explicit information and begin to infer simple implied information in short texts used in the classroom.",
            "EFL.3.4.p.25. Writes short written opinions about literary works read, stating what surprised the reader and what stayed in mind.",
            "EFL.3.3.p.40. Uses illustrated dictionaries and simple digital tools with teacher support to expand vocabulary.",
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to the stories, opinions, and recommendations of classmates, family members, and community members, in English and in the languages of the place.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.15",
    descripcion: "Rewriting traditional stories from local and global contexts into new settings through short, illustrated texts in English, exploring how stories change over time, across places, and through different perspectives",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; and familiar pronunciation patterns encountered in everyday communication.",
            "EFL.3.3.d.24. Short literary texts (rhymes, short stories, riddles): creative and playful texts, including illustrated stories and riddles.",
            "EFL.3.3.d.29. Strategies for reading English texts with support from visual elements and familiar languages.",
            "EFL.3.3.d.33. Cultural productions from the community and other places: stories, songs, dances, and visual arts as examples of diverse cultural expression.",
          ],
          procedimentales: [
            "EFL.3.3.p.16. Reads illustrated stories, rhymes, and poems from communities that learn or use English, identifying main ideas and key images.",
            "EFL.3.3.p.17. Reads short chronicles and testimonies to identify what has changed and what remains.",
            "EFL.3.3.p.22. Recognizes the opening and closing of narrative and informational texts.",
            "EFL.3.4.p.26. Rewrites traditional stories by changing simple elements such as characters or places.",
          ],
          actitudinales: [
            "EFL.3.2.a.4. Values the languages of Ecuador and the local community as part of classroom interactions.",
            "EFL.3.3.a.16. Values stories and experiences from the place as knowledge shared by the community.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.3.d.24. Short literary texts (rhymes, short stories, riddles): creative, playful texts from communities that learn or use English in different places, including illustrated stories and riddles that invite language play.",
            "EFL.3.3.d.29. Intercultural reading with mediation between languages: strategies for reading English texts with support from community languages and visual elements.",
            "EFL.3.3.d.33. Cultural productions from the community and other places: stories, songs, dances, visual arts, films, and crafts made by communities in Ecuador and other regions as examples of diverse aesthetic and expressive traditions.",
          ],
          procedimentales: [
            "EFL.3.3.p.16. Reads illustrated stories, rhymes, and poems from communities that learn or use English in different places, identifying main ideas, key images, and simple messages.",
            "EFL.3.3.p.17. Reads short chronicles and testimonies to identify what has changed, what remains, and simple lessons from the past.",
            "EFL.3.3.p.22. Recognizes the basic structure of narrative and informational texts: opening, development, and closing.",
            "EFL.3.4.p.26. Rewrites traditional stories by changing the time, place, or characters in short illustrated texts.",
          ],
          actitudinales: [
            "EFL.3.2.a.4. Values the languages of Ecuador and the local community as part of the classroom's shared repertoire.",
            "EFL.3.3.a.16. Values the living memory of the place and the country as knowledge shared across generations.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.3.d.24. Short literary texts (rhymes, short stories, riddles): creative, playful texts from communities that learn or use English in different places, including illustrated stories and riddles that invite language play.",
            "EFL.3.3.d.29. Intercultural reading with mediation between languages: strategies for reading English texts with support from community languages and visual elements, and for translating meaning between English and the languages of the place.",
            "EFL.3.3.d.33. Cultural productions from the community and other places: stories, songs, dances, visual arts, films, and crafts made by communities in Ecuador and in other regions as examples of diverse aesthetic and expressive traditions.",
          ],
          procedimentales: [
            "EFL.3.3.p.16. Reads illustrated stories, rhymes, and poems from communities that learn or use English in different places, identifying main ideas and key images.",
            "EFL.3.3.p.17. Reads short chronicles and testimonies to identify what has changed, what remains, and what can be learned from different memories of the past.",
            "EFL.3.3.p.22. Recognizes the basic structure of narrative and informational texts: opening, development, and closing.",
            "EFL.3.4.p.26. Rewrites traditional stories of the place and the world, setting them in another time, place, or body, in short, illustrated texts.",
          ],
          actitudinales: [
            "EFL.3.2.a.4. Values the languages of Ecuador and the local community as part of the classroom's shared repertoire.",
            "EFL.3.3.a.16. Values the living memory of the place and the country as knowledge that is transmitted and cared for across generations.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.16",
    descripcion: "Creating and solving riddles about everyday objects and activities through short texts, exploring language play, and recognizing riddles as a form of cultural knowledge",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community.",
            "EFL.3.3.d.24. Short literary texts (rhymes, short stories, riddles): creative and playful texts, including illustrated stories and riddles.",
            "EFL.3.4.d.32. Shared community practices: games, celebrations, songs, and food traditions.",
          ],
          procedimentales: [
            "EFL.3.2.p.8. Recites rhymes, riddles, and short dialogues with teacher support.",
            "EFL.3.3.p.20. Solves short riddles by identifying clues and keywords.",
            "EFL.3.4.p.27. Composes short riddles about everyday objects using simple clues.",
            "EFL.3.4.p.36. Uses words from the community language within English sentences to name familiar objects and places.",
            "EFL.3.1.p.38. Uses images, gestures, and drawings to help communicate in English.",
            "EFL.3.3.p.42. Notices similarities between English and the languages known to support comprehension.",
          ],
          actitudinales: [
            "EFL.3.2.a.6. Recognizes the languages of the place as support for understanding English in familiar learning situations.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community. Shared practices passed down across generations, including crafts and ways of caring.",
            "EFL.3.3.d.24. Short literary texts (rhymes, short stories, riddles): creative, playful texts from communities that learn or use English in different places, including illustrated stories and riddles that invite language play.",
          ],
          procedimentales: [
            "EFL.3.2.p.8. Recites and dramatizes rhymes, riddles, short literary passages, and dialogues with appropriate intonation and expression.",
            "EFL.3.3.p.20. Solves short riddles by identifying clues and keywords and giving brief explanations.",
            "EFL.3.4.p.27. Composes short, original riddles using clues and simple wordplay.",
            "EFL.3.4.p.36. Uses words from other known languages within English sentences as cultural bridges.",
            "EFL.3.3.p.42. Notices similarities and differences between English and the languages known to support comprehension.",
          ],
          actitudinales: [
            "EFL.3.2.a.6. Recognizes the languages of the place as a bridge for understanding English and expressing ideas.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.24. Short literary texts (rhymes, short stories, riddles): creative, playful texts from communities that learn or use English in different places, including illustrated stories and riddles that invite language play.",
            "EFL.3.4.d.32. Shared practices of the community passed down across generations: games, celebrations, food preparation, crafts, songs, and ways of caring that are transmitted within families and communities and recognized as living knowledge.",
          ],
          procedimentales: [
            "EFL.3.2.p.8. Recites and dramatize rhymes, riddles, short literary passages, and dialogues with appropriate intonation and expression.",
            "EFL.3.3.p.20. Solves short riddles by identifying clues and keywords, and briefly explain the reasoning behind your answers.",
            "EFL.3.4.p.27. Composes short, original riddles about everyday objects and activities, using clues and wordplay, in English and in the languages of the place.",
            "EFL.3.4.p.36. Uses words from other languages known within English sentences as cultural bridges, and name objects, practices, and places in both English and the community language.",
            "EFL.3.3.p.42. Notices similarities and differences between English and the languages known to support comprehension and production.",
          ],
          actitudinales: [
            "EFL.3.2.a.6. Recognizes the languages of the place as a bridge for understanding English and for making oneself understood.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.17",
    descripcion: "Promoting health and well-being through short guides and posters on body care that describe practices that support physical and emotional well-being and that value shared health knowledge",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds.",
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community.",
            "EFL.3.2.d.11. Vocabulary for health and the body: body parts, hygiene habits, food, rest, and movement.",
            "EFL.3.4.d.15. Simple past with regular verbs and was/were in affirmative sentences.",
            "EFL.3.4.d.18. Modals can and must to express ability and obligation in everyday situations.",
            "EFL.3.4.d.23. Informational texts such as guides and infographics with headings and images.",
            "EFL.3.4.d.30. Collaborative writing: planning ideas and writing a first version with a partner.",
          ],
          procedimentales: [
            "EFL.3.2.p.5. Describes daily activities and routines using simple sentences in the present tense.",
            "EFL.3.1.p.28. Designs short illustrated posters about body care and hygiene using simple sentences.",
            "EFL.3.2.p.43. Describes simple healthy habits related to body care.",
          ],
          actitudinales: [
            "EFL.3.2.a.3. Is willing to participate in English learning activities, recognizing errors as part of the learning process.",
            "EFL.3.4.a.12. Cares for one's own body and respects classmates' bodies during classroom learning activities.",
            "EFL.3.4.a.13. Recognizes family members who support the care of the body and well-being.",
            "EFL.3.4.a.14. Values knowledge about the body, food, rest, and movement as part of personal well-being.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), basic comma use, common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds and word stress.",
            "EFL.3.2.d.6. Vocabulary for expanded daily routines and free-time activities: household chores, school schedules, hobbies, sports, and leisure at home and in the community. Vocabulary for health and the body: body parts, common health conditions, hygiene habits, food, rest, movement, and basic medical care.",
            "EFL.3.4.d.15. Simple past with regular and high-frequency irregular verbs in affirmative and negative forms to recount events and experiences.",
            "EFL.3.4.d.18. Modals can, could, should, and must for ability, possibility, advice, and obligation in guided contexts.",
            "EFL.3.4.d.23. Informational texts (guides, infographics, questionnaires) using numbered steps, headings, icons, and visual cues.",
            "EFL.3.4.d.30. Collaborative writing: planning, drafting, revising with short feedback, and preparing a final version.",
          ],
          procedimentales: [
            "EFL.3.2.p.5. Narrates daily activities, games, and routines using connected sentences with basic sequence connectors and present or simple past forms.",
            "EFL.3.1.p.28. Designs short illustrated guides and posters about body care, hygiene, food, and movement using imperative forms and short descriptive sentences.",
            "EFL.3.2.p.43. Describes body care practices and healthy routines in short oral or written presentations.",
          ],
          actitudinales: [
            "EFL.3.2.a.3. Is willing to speak, read, and write in English, treating errors as a natural part of learning.",
            "EFL.3.4.a.12. Cares for one's own body and respects classmates' bodies in all learning activities. Recognizes people in the family and community who support the care of the body and well-being.",
            "EFL.3.4.a.14. Values knowledge about the body, food, rest, and movement as shared learning within the community.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), basic comma use, common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds, word stress, and simple intonation patterns.",
            "EFL.3.2.d.11. Vocabulary for health and the body: body parts, common health conditions, hygiene habits, food, rest, movement, and basic medical care.",
            "EFL.3.4.d.15. Simple past for narration: regular and high-frequency irregular verbs (was/were, went, had, said, made, came), affirmative, negative, and question forms used to recount events and experiences.",
            "EFL.3.4.d.18. Modals can, could, should, and must for ability, possibility, advice, and obligation: receptive and guided productive use in everyday transactions, guides, infographics, and agreements.",
            "EFL.3.4.d.23. Informational texts (guides, infographics, questionnaires): short factual texts that explain, instruct, or present data using numbered steps, headings, icons, and visual cues.",
            "EFL.3.4.d.30. Collaborative written production: stages and strategies for drafting, revising, and sharing texts in pairs and small groups — planning with notes, writing a first version, giving and receiving short feedback, and presenting a final product.",
          ],
          procedimentales: [
            "EFL.3.2.p.5. Narrates daily activities, games, and routines using connected sentences with basic sequence connectors and simple past or present tense forms.",
            "EFL.3.1.p.28. Designs short, illustrated guides and posters on body care, hygiene, rest, food, and movement using imperative forms and short descriptive sentences.",
            "EFL.3.2.p.43. Describes body care practices and healthy routines in short oral or written presentations.",
          ],
          actitudinales: [
            "EFL.3.2.a.3. Is willing to speak, read, and write in English throughout the school year, treating errors as a natural part of learning.",
            "EFL.3.4.a.13. Recognizes the people in the family and the community who sustain the care of the body and well-being.",
            "EFL.3.4.a.14. Values knowledge about the body, food, rest, and movement as shared learning that belongs to the whole community.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.18",
    descripcion: "Recommending cultural productions from the community and around the world through short, illustrated posts that describe and share opinions on meaningful works while respecting diverse tastes and perspectives",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.2.d.8. Vocabulary for transport and travel: means of transport, directions, and journeys.",
            "EFL.3.4.d.13. Vocabulary for food preparation: ingredients and basic cooking actions.",
            "EFL.3.4.d.25. Digital texts with images and headings that share everyday experiences.",
            "EFL.3.4.d.31. Presentation of information using simple images or diagrams.",
            "EFL.3.3.d.33. Cultural productions from the community and other places: stories, songs, dances, and visual arts as examples of diverse cultural expression.",
            "EFL.3.3.d.34. Historical memories and testimonies: photographs, objects, and simple oral accounts about important moments from the community.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, and celebrations that reflect different ways of life.",
          ],
          procedimentales: [
            "EFL.3.2.p.15. Expresses simple agreement or disagreement using familiar expressions.",
            "EFL.3.3.p.18. Reads short accounts of journeys and experiences in different communities to identify places and events.",
            "EFL.3.3.p.19. Reads illustrated blog entries to identify aspects of the writer's daily life.",
            "EFL.3.4.p.25. Writes short opinions about literary works, stating what they liked or found interesting.",
            "EFL.3.3.p.29. Writes short, illustrated posts recommending cultural productions with simple reasons.",
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to the stories and opinions of classmates and family members in English and in the languages of the place.",
            "EFL.3.2.a.2. Accepts English as one of many languages used to communicate and learn about the world.",
            "EFL.3.2.a.10. Treats with respect classmates who think or feel differently in classroom interactions.",
            "EFL.3.3.a.17. Appreciates artistic forms from the place and recognizes different ways of expressing creativity.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.2.d.8. Vocabulary for transport and travel: means of transport, directions, distances, and journeys.",
            "EFL.3.4.d.13. Vocabulary for food preparation and community practices: ingredients, cooking actions, and names of shared dishes.",
            "EFL.3.4.d.25. Digital texts (blog entries, illustrated posts) that share experiences, opinions, or recommendations.",
            "EFL.3.4.d.31. Presentation of information combining spoken or written text with visual support.",
            "EFL.3.3.d.33. Cultural productions from the community and other places: stories, songs, dances, visual arts, films, and crafts made by communities in Ecuador and other regions as examples of diverse aesthetic and expressive traditions.",
            "EFL.3.3.d.34. Historical memories and testimonies: chronicles, oral accounts, photographs, objects, and timelines that record important moments from the community and the country.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, celebrations, and ways of life that show the diversity of English-speaking communities worldwide.",
          ],
          procedimentales: [
            "EFL.3.2.p.15. Expresses respectful agreement and disagreement in short classroom discussions.",
            "EFL.3.3.p.18. Reads short accounts of journeys and experiences in communities different from one's own to recognize similarities and differences.",
            "EFL.3.3.p.19. Reads illustrated blog entries to recognize aspects of the writer's daily life and compare them with personal experiences.",
            "EFL.3.4.p.25. Writes short opinions about literary works, stating what surprised them or what they remember most.",
            "EFL.3.3.p.29. Writes short, illustrated posts recommending cultural productions from the community or other places, providing brief reasons.",
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to stories, opinions, and recommendations of classmates, family members, and community members in English and in the languages of the place.",
            "EFL.3.2.a.2. Accepts English as one of many languages, equally valid for communicating and learning about different people and contexts.",
            "EFL.3.2.a.10. Treats with respect those who think or feel differently and listens to their reasons in classroom exchanges.",
            "EFL.3.3.a.17. Appreciates artistic forms from the place and the world, recognizing different aesthetic expressions.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.2.d.8. Vocabulary for transport and travel: means of transport, directions, distances, journeys, and experiences of moving between places.",
            "EFL.3.4.d.13. Vocabulary for food preparation and community practices: ingredients, cooking actions, names of shared dishes, and practices of preparing and sharing food.",
            "EFL.3.4.d.25. Digital texts (blog entries, illustrated posts): short written texts with images, headings, and hyperlinks that share everyday experiences, opinions, or recommendations for a school or community audience.",
            "EFL.3.4.d.31. Presentation of information with visual support: strategies for combining spoken or written text with images, diagrams, and graphic organizers to share findings, recommendations, or project results with a familiar audience.",
            "EFL.3.3.d.33. Cultural productions from the community and other places: stories, songs, dances, visual arts, films, and crafts made by communities in Ecuador and in other regions as examples of diverse aesthetic and expressive traditions.",
            "EFL.3.3.d.34. Historical memories and testimonies: chronicles, oral accounts, photographs, objects, and timelines that record important moments from the community, the country, and the world from the perspective of different voices.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, celebrations, and ways of life that show the diversity of English-speaking communities worldwide.",
          ],
          procedimentales: [
            "EFL.3.2.p.15. Expresses respectful agreement and disagreement and suggest alternatives in short classroom discussions.",
            "EFL.3.3.p.18. Reads short accounts of journeys and experiences in communities different from one's own to broaden one's knowledge of the world.",
            "EFL.3.3.p.19. Reads illustrated blog entries to recognize aspects of the writer's daily life and connect them to one's own experience.",
            "EFL.3.4.p.25. Writes short written opinions about literary works read, stating what surprised the reader and what stayed in mind.",
            "EFL.3.3.p.29. Writes short, illustrated posts recommending cultural productions from the community or around the world, providing brief reasons for each recommendation.",
          ],
          actitudinales: [
            "EFL.3.1.a.7. Listens attentively to the stories, opinions, and recommendations of classmates, family members, and community members, in English and in the languages of the place.",
            "EFL.3.2.a.2. Accepts English as one of many languages, equally valid for understanding the world and meeting new people.",
            "EFL.3.2.a.10. Treats with respect those who think or feel differently and takes others' reasons into account.",
            "EFL.3.3.a.17. Appreciates the artistic forms of the place and the world, recognizing the diversity of aesthetic expressions.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.19",
    descripcion: "Conducting simple scientific inquiry into local topics through English-language questionnaires by asking questions, collecting information, and sharing findings, valuing different ways of understanding the world",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; and familiar pronunciation patterns encountered in everyday communication.",
            "EFL.3.4.d.9. Vocabulary for weather and seasons.",
            "EFL.3.2.d.11. Vocabulary for health and the body: body parts, hygiene habits, food, rest, and movement.",
            "EFL.3.4.d.21. Question forms using Wh- questions and yes/no questions.",
            "EFL.3.4.d.23. Informational texts such as guides and infographics with headings and images.",
            "EFL.3.4.d.35. The natural world: common landscapes, animals, and plants of the local environment.",
          ],
          procedimentales: [
            "EFL.3.2.p.9. Shares orally simple information learned from a reading or classroom activity.",
            "EFL.3.2.p.12. Asks and answers simple questions to gather personal information from classmates.",
            "EFL.3.3.p.21. Locates explicit information in short texts used in the classroom.",
            "EFL.3.4.p.30. Drafts short questionnaires with simple questions for classroom inquiries.",
            "EFL.3.1.p.37. Shares simple information from another language in English with teacher support.",
            "EFL.3.4.p.44. Inquires and records simple information about the natural world through guided questions.",
          ],
          actitudinales: [
            "EFL.3.1.a.8. Respects turn-taking and the time of whoever is speaking in classroom exchanges and simple discussions.",
            "EFL.3.4.a.13. Recognizes family members who support the care of the body and well-being.",
            "EFL.3.4.a.19. Cares for living beings and places mentioned in classroom activities.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.4.d.9. Vocabulary for weather, seasons, and the natural environment: climate, landscapes, plants, and animals.",
            "EFL.3.2.d.11. Vocabulary for health and the body: body parts, common health conditions, hygiene habits, food, rest, movement, and basic medical care.",
            "EFL.3.4.d.21. Question forms including how often, how long, and how much/many.",
            "EFL.3.4.d.23. Informational texts (guides, infographics, questionnaires) using numbered steps, headings, icons, and visual cues.",
            "EFL.3.4.d.35. The natural world of Ecuador: ecosystems, landscapes, animals, plants, and community care practices.",
          ],
          procedimentales: [
            "EFL.3.2.p.9. Shares orally what has been learned from an inquiry, a reading, or an interview, using short and clear statements.",
            "EFL.3.2.p.12. Conducts short interviews with classmates and family members by asking Wh- and yes/no questions.",
            "EFL.3.3.p.21. Locates explicit information and infers simple implied information in short texts used in the classroom with support.",
            "EFL.3.4.p.30. Drafts short questionnaires in English and the community's languages for guided inquiries.",
            "EFL.3.1.p.37. Summarizes orally or in writing simple information read or heard in another language in English.",
            "EFL.3.4.p.44. Inquires and records information about the natural world using guided questions and simple notes.",
          ],
          actitudinales: [
            "EFL.3.1.a.8. Respects turn-taking and the time of whoever is speaking in exchanges, interviews, and class discussions.",
            "EFL.3.4.a.13. Recognizes people in the family and community who support the care of the body and well-being.",
            "EFL.3.4.a.19. Cares for living beings and places mentioned in classroom activities, demonstrating responsibility toward the natural world.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.1.d.1. Features of English: short, simple sentences; high-frequency vocabulary; basic connectors; and familiar pronunciation patterns encountered in everyday communication at school and in the community.",
            "EFL.3.4.d.9. Vocabulary for weather, seasons, and the natural environment: climate, landscapes, ecosystems, plants, and animals of the place and other regions.",
            "EFL.3.2.d.11. Vocabulary for health and the body: body parts, common health conditions, hygiene habits, food, rest, movement, and basic medical care.",
            "EFL.3.4.d.21. Question forms including how often, how long, and how much/many: Wh- questions, yes/no questions, and basic indirect question structures (Can you tell me...?) used in interviews, inquiries, and conversations.",
            "EFL.3.4.d.23. Informational texts (guides, infographics, questionnaires): short factual texts that explain, instruct, or present data using numbered steps, headings, icons, and visual cues.",
            "EFL.3.4.d.35. The natural world of the place and other regions: ecosystems, landscapes, animals, and plants of Ecuador and the Americas, and the practices communities use to care for and live with the natural world.",
          ],
          procedimentales: [
            "EFL.3.2.p.9. Shares orally what has been learned from an inquiry, a reading, or an interview, using short and clear statements.",
            "EFL.3.2.p.12. Conducts short interviews with family members, neighbors, and classmates by formulating Wh- and yes/no questions and recording their answers.",
            "EFL.3.3.p.21. Locates explicit information and begin to infer simple implied information in short texts used in the classroom.",
            "EFL.3.4.p.30. Drafts short questionnaires in English and the community's languages for scientific inquiries about local topics.",
            "EFL.3.1.p.37. Summarizes, orally or in writing, the information read or heard in another language in English in the classroom.",
            "EFL.3.4.p.44. Inquires and records information about the natural world of the place and other regions through guided questions and simple note-taking.",
          ],
          actitudinales: [
            "EFL.3.1.a.8. Respects turn-taking and the time of whoever is speaking in exchanges, interviews, and class discussions.",
            "EFL.3.4.a.13. Recognizes the people in the family and the community who sustain the care of the body and well-being.",
            "EFL.3.4.a.19. Cares for living beings and places mentioned in classroom activities, demonstrating responsibility toward the natural world.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.20",
    descripcion: "Developing artistic understanding through presentations supported by images and short texts that describe artistic expressions from local and global contexts, and recognize the diversity of aesthetic forms",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.17. Comparatives using regular forms to compare people, places, and objects.",
            "EFL.3.4.d.20. Sentence connectors of sequence: first, then, after, before, finally.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, and celebrations that reflect different ways of life.",
          ],
          procedimentales: [
            "EFL.3.2.p.6. Describes places, people, and objects using simple words and short descriptive sentences.",
            "EFL.3.2.p.9. Shares orally simple information learned from a reading or classroom activity.",
            "EFL.3.4.p.31. Prepares simple posters or drawings with short English texts for presentations.",
          ],
          actitudinales: [
            "EFL.3.1.a.23. Shares with confidence what is being learned in classroom activities with support.",
            "EFL.3.2.a.2. Accepts English as one of many languages used to communicate and learn about the world.",
            "EFL.3.3.a.17. Appreciates artistic forms from the place and recognizes different ways of expressing creativity.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.17. Comparatives and common superlatives to compare people, places, objects, and practices.",
            "EFL.3.4.d.20. Sentence connectors of sequence and cause: first, then, after, before, finally; because, so.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, celebrations, and ways of life that show the diversity of English-speaking communities worldwide.",
          ],
          procedimentales: [
            "EFL.3.2.p.6. Describes places, people, objects, and community practices using concrete details.",
            "EFL.3.2.p.9. Shares orally what has been learned from an inquiry, a reading, or an interview, using short and clear statements.",
            "EFL.3.4.p.31. Prepares graphic supports with short English texts for oral presentations.",
          ],
          actitudinales: [
            "EFL.3.1.a.23. Shares with confidence what is being learned and the questions that arise during classroom activities.",
            "EFL.3.2.a.2. Accepts English as one of many languages, equally valid for communicating and learning about different people and contexts.",
            "EFL.3.3.a.17. Appreciates artistic forms from the place and the world, recognizing different aesthetic expressions.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.17. Comparatives and superlatives: regular and common irregular forms (bigger, more important, the tallest, the most common) used to compare places, objects, people, and practices.",
            "EFL.3.4.d.20. Sentence connectors of sequence, contrast, and cause: first, then, after, before, finally (sequence); however, although (contrast); because, so (cause/result), used in narratives and explanations.",
            "EFL.3.4.d.31. Presentation of information with visual support: strategies for combining spoken or written text with images, diagrams, and graphic organizers to share findings, recommendations, or project results with a familiar audience.",
            "EFL.3.3.d.36. Everyday life in English-speaking communities: routines, foods, games, school life, celebrations, and ways of life that show the diversity of English-speaking communities worldwide.",
          ],
          procedimentales: [
            "EFL.3.2.p.6. Describes places, people, objects, and community practices using concrete details and simple comparisons.",
            "EFL.3.2.p.9. Shares orally what has been learned from an inquiry, a reading, or an interview, using short and clear statements.",
            "EFL.3.4.p.31. Prepares graphic supports — slides, panels, illustrated posters — with short English texts for oral presentations on the arts of the place and the world.",
          ],
          actitudinales: [
            "EFL.3.1.a.23. Shares with confidence what is being learned, the questions that arise, and the discoveries made in classroom activities.",
            "EFL.3.2.a.2. Accepts English as one of many languages, equally valid for understanding the world and meeting new people.",
            "EFL.3.3.a.17. Appreciates the artistic forms of the place and the world, recognizing the diversity of aesthetic expressions.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.21",
    descripcion: "Expanding knowledge of community work and occupations through short reports describing local jobs and recognizing workers as holders of knowledge and experience",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.2.d.7. Vocabulary for community and neighborhood places: stores, markets, parks, libraries, and transport stops.",
            "EFL.3.2.d.10. Vocabulary for jobs, trades, and workplaces: names of occupations and common work settings.",
            "EFL.3.4.d.31. Presentation of information using simple images or diagrams.",
          ],
          procedimentales: [
            "EFL.3.2.p.7. Presents familiar community places or celebrations orally in English with visual support.",
            "EFL.3.2.p.12. Asks and answers simple questions to gather personal information from classmates.",
            "EFL.3.4.p.32. Writes short reports about occupations observed in the community.",
          ],
          actitudinales: [
            "EFL.3.2.a.18. Recognizes people who carry out trades and work in the community as important members of community life.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.2.d.7. Vocabulary for community and neighborhood places: stores, markets, fairs, parks, clinics, libraries, transport stops, and everyday services.",
            "EFL.3.2.d.10. Vocabulary for jobs, trades, and workplaces: names of occupations, tools, tasks, and work settings common to the community.",
            "EFL.3.4.d.31. Presentation of information combining spoken or written text with visual support.",
          ],
          procedimentales: [
            "EFL.3.2.p.7. Presents community practices, trades, and celebrations orally in English with visual support such as photographs, drawings, or objects.",
            "EFL.3.2.p.12. Conducts short interviews with classmates and family members by asking Wh- and yes/no questions.",
            "EFL.3.4.p.32. Writes short community reports on trades and occupations using observations.",
          ],
          actitudinales: [
            "EFL.3.2.a.18. Recognizes people who carry out trades and work in the community as subjects of knowledge and contributors to community life.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.2.d.7. Vocabulary for community and neighborhood places: stores, markets, fairs, parks, clinics, libraries, transport stops, and services used in everyday life.",
            "EFL.3.2.d.10. Vocabulary for jobs, trades, and workplaces: names of occupations, tools, tasks, and work settings common to the community.",
          ],
          procedimentales: [
            "EFL.3.2.p.7. Presents community practices, trades, and celebrations orally in English with visual support such as photographs, drawings, or objects.",
            "EFL.3.2.p.12. Conducts short interviews with family members, neighbors, and classmates by formulating Wh- and yes/no questions and recording their answers.",
            "EFL.3.4.p.32. Writes short community reports on trades and occupations, recording observations and brief quotes from the people who perform them.",
          ],
          actitudinales: [
            "EFL.3.2.a.18. Recognizes the people who carry out trades and work in the community as subjects of knowledge and agents of community life.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.22",
    descripcion: "Solving everyday digital challenges through short infographics and visual explanations, supporting peers and families in using digital devices, and recognizing digital cooperation as collective learning",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.12. Vocabulary for technology and digital devices: names of common devices and their basic functions.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: celebrations, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.18. Modals can and must to express ability and obligation in everyday situations.",
            "EFL.3.4.d.23. Informational texts such as guides and infographics with headings and images.",
            "EFL.3.4.d.26. Functional texts such as invitations, notices, and warnings used in school.",
            "EFL.3.4.d.30. Collaborative writing: planning ideas and writing a first version with a partner.",
          ],
          procedimentales: [
            "EFL.3.1.p.3. Follows short sequenced instructions to complete classroom activities and games.",
            "EFL.3.2.p.13. Names familiar technological devices and describes their basic use.",
            "EFL.3.4.p.33. Designs simple illustrated guides with steps to use or care for digital devices.",
            "EFL.3.1.p.38. Uses images, gestures, and drawings to help communicate in English.",
            "EFL.3.4.p.46. Participates in writing simple classroom agreements and notices.",
          ],
          actitudinales: [
            "EFL.3.3.a.24. Practices responsible digital behavior by asking permission before sharing information in classroom contexts.",
            "EFL.3.2.a.9. Asks for help when needed during classroom activities.",
            "EFL.3.4.a.21. Participates in collective agreements and cares for shared school spaces with support.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.12. Vocabulary for technology and digital devices: device names, parts, functions, and care practices used at home and at school.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: gatherings, celebrations, agreements, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.18. Modals can, could, should, and must for ability, possibility, advice, and obligation in guided contexts.",
            "EFL.3.4.d.23. Informational texts (guides, infographics, questionnaires) using numbered steps, headings, icons, and visual cues.",
            "EFL.3.4.d.26. Functional texts (invitations, warnings, agreements, school notices) that organize shared school and community life.",
            "EFL.3.4.d.30. Collaborative writing: planning, drafting, revising with short feedback, and preparing a final version.",
          ],
          procedimentales: [
            "EFL.3.1.p.3. Follows sequenced instructions in short videos to complete tasks, games, and classroom activities.",
            "EFL.3.2.p.13. Describes technological devices, explains their use, and asks for simple help when needed.",
            "EFL.3.4.p.33. Designs short infographics with diagrams and step-by-step instructions about digital devices.",
            "EFL.3.1.p.38. Uses images, gestures, sounds, and drawings to support comprehension and communication in English.",
            "EFL.3.4.p.46. Participates in the collective drafting of agreements and notices for shared classroom life.",
          ],
          actitudinales: [
            "EFL.3.3.a.24. Practices responsible digital behavior by asking permission before sharing and respecting information used in classroom and online contexts.",
            "EFL.3.2.a.9. Asks for help when needed and offers help to classmates when possible.",
            "EFL.3.4.a.21. Participates responsibly in collective agreements and in the care of shared school spaces.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.12. Vocabulary for technology and digital devices: device names, parts, functions, and care practices used at home, at school, and in the community.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: gatherings, celebrations, agreements, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.18. Modals can, could, should, and must for ability, possibility, advice, and obligation: receptive and guided productive use in everyday transactions, guides, infographics, and agreements.",
            "EFL.3.4.d.23. Informational texts (guides, infographics, questionnaires): short factual texts that explain, instruct, or present data using numbered steps, headings, icons, and visual cues.",
            "EFL.3.4.d.26. Functional texts (invitations, warnings, agreements, school notices): short purposeful texts that organize shared life, set expectations, and communicate rights and responsibilities in the school and community.",
            "EFL.3.4.d.30. Collaborative written production: stages and strategies for drafting, revising, and sharing texts in pairs and small groups — planning with notes, writing a first version, giving and receiving short feedback, and presenting a final product.",
          ],
          procedimentales: [
            "EFL.3.1.p.3. Follows sequenced instructions in short videos to complete tasks, play games, and participate in classroom activities.",
            "EFL.3.2.p.13. Sustains short conversations about technological devices: name them, describe their use, and ask for help to solve a simple difficulty.",
            "EFL.3.4.p.33. Designs short infographics with diagrams and step-by-step instructions to help classmates and families solve common difficulties with digital devices.",
            "EFL.3.1.p.38. Uses images, gestures, sounds, and drawings to support comprehension and production when English words alone are not enough.",
            "EFL.3.4.p.46. Participates in the collective drafting of agreements and notices for the school's shared life.",
          ],
          actitudinales: [
            "EFL.3.2.a.9. Asks for help when needed and offers it when possible.",
            "EFL.3.3.a.24. Is committed to responsible digital behavior: asks permission before sharing, cites sources, and respects what circulates in the classroom and online.",
            "EFL.3.4.a.21. Participates responsibly in collective agreements and in the care of shared school spaces.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.23",
    descripcion: "Creating warnings and agreements for school life through posters, identifying practices that ensure safety and care in shared spaces, and promoting collective responsibility in the school community",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including illustrated messages, announcements, invitations, and short narratives used in school and community contexts.",
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: celebrations, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.16. Future with going to for simple plans and intentions.",
            "EFL.3.4.d.26. Functional texts such as invitations, notices, and warnings used in school.",
          ],
          procedimentales: [
            "EFL.3.4.p.34. Writes short warnings and classroom notices using simple expressions.",
            "EFL.3.4.p.46. Participates in writing simple classroom agreements and notices.",
          ],
          actitudinales: [
            "EFL.3.2.a.10. Treats with respect classmates who think or feel differently in classroom interactions.",
            "EFL.3.4.a.21. Participates in collective agreements and cares for shared school spaces with support.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including short narratives, announcements, blog posts, illustrated messages, infographics, invitations, and guides used in school and community contexts.",
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), basic comma use, common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds and word stress.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: gatherings, celebrations, agreements, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.16. Future with will for announcements and spontaneous decisions, and be going to for plans.",
            "EFL.3.4.d.26. Functional texts (invitations, warnings, agreements, school notices) that organize shared school and community life.",
          ],
          procedimentales: [
            "EFL.3.4.p.34. Writes short warnings and agreements using obligation and prohibition forms.",
            "EFL.3.4.p.46. Participates in the collective drafting of agreements and notices for shared classroom life.",
          ],
          actitudinales: [
            "EFL.3.2.a.10. Treats with respect those who think or feel differently and listens to their reasons in classroom exchanges.",
            "EFL.3.4.a.21. Participates responsibly in collective agreements and in the care of shared school spaces.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.3.d.4. Familiarity with common everyday English text types, including short narratives, announcements, blog posts, illustrated messages, infographics, invitations, guides, and basic agreements used in school and community contexts.",
            "EFL.3.1.d.5. Knowledge of basic spoken and written English conventions, including capitalization, end punctuation (period, question mark, exclamation mark), basic comma use, common spelling patterns of high-frequency words, and basic pronunciation features such as short and long vowel sounds, word stress, and simple intonation patterns.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: gatherings, celebrations, agreements, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.16. Future with will and be going to: use of will for announcements and spontaneous decisions and be going to for plans and intentions in short texts and oral exchanges.",
            "EFL.3.4.d.26. Functional texts (invitations, warnings, agreements, school notices): short purposeful texts that organize shared life, set expectations, and communicate rights and responsibilities in the school and community.",
          ],
          procedimentales: [
            "EFL.3.4.p.34. Writes short warnings and agreements in posters and notices about everyday school situations, using obligation and prohibition forms.",
            "EFL.3.4.p.46. Participates in the collective drafting of agreements and notices for the school's shared life.",
          ],
          actitudinales: [
            "EFL.3.2.a.10. Treats with respect those who think or feel differently and takes others' reasons into account.",
            "EFL.3.4.a.21. Participates responsibly in collective agreements and in the care of shared school spaces.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.3.24",
    descripcion: "Collaborating on the planning and creation of school projects through illustrated outlines, designing, organizing, and agreeing on collective actions, and recognizing shared creation as a means of transforming the school environment",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.9. Vocabulary for weather and seasons.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: celebrations, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.16. Future with going to for simple plans and intentions.",
            "EFL.3.4.d.19. Present continuous for actions happening now.",
            "EFL.3.4.d.26. Functional texts such as invitations, notices, and warnings used in school.",
            "EFL.3.4.d.30. Collaborative writing: planning ideas and writing a first version with a partner.",
            "EFL.3.4.d.35. The natural world: common landscapes, animals, and plants of the local environment.",
          ],
          procedimentales: [
            "EFL.3.2.p.11. Invites classmates to simple classroom activities using familiar expressions.",
            "EFL.3.4.p.35. Drafts simple planning outlines for a classroom activity.",
            "EFL.3.4.p.45. Describes landscapes, climates, plants, and animals using short descriptive sentences.",
            "EFL.3.4.p.47. Plans a classroom task with classmates by identifying materials and simple responsibilities.",
            "EFL.3.2.p.48. Participates in simple group productions and shares what was learned.",
            "EFL.3.4.p.44. Inquires and records simple information about the natural world through guided questions.",
          ],
          actitudinales: [
            "EFL.3.2.a.22. Cooperates with classmates in shared classroom tasks.",
            "EFL.3.4.a.20. Recognizes elements of the natural world of Ecuador as part of the environment that deserves care.",
            "EFL.3.4.a.19. Cares for living beings and places mentioned in classroom activities.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.9. Vocabulary for weather, seasons, and the natural environment: climate, landscapes, plants, and animals.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: gatherings, celebrations, agreements, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.16. Future with will for announcements and spontaneous decisions, and be going to for plans.",
            "EFL.3.4.d.19. Present continuous for ongoing actions and simple planned actions.",
            "EFL.3.4.d.26. Functional texts (invitations, warnings, agreements, school notices) that organize shared school and community life.",
            "EFL.3.4.d.30. Collaborative writing: planning, drafting, revising with short feedback, and preparing a final version.",
            "EFL.3.4.d.35. The natural world of Ecuador: ecosystems, landscapes, animals, plants, and community care practices.",
          ],
          procedimentales: [
            "EFL.3.2.p.11. Invites and agrees with classmates on tasks and gatherings using basic future forms.",
            "EFL.3.4.p.35. Drafts illustrated planning outlines identifying materials and roles.",
            "EFL.3.4.p.45. Compares landscapes, climates, plants, and animals using basic comparative forms.",
            "EFL.3.4.p.47. Plans a task or celebration with classmates by organizing roles, materials, and simple timelines.",
            "EFL.3.2.p.48. Cooperates with others in collective productions and shares orally what has been learned.",
            "EFL.3.4.p.44. Inquires and records information about the natural world using guided questions and simple notes.",
          ],
          actitudinales: [
            "EFL.3.2.a.22. Cooperates with classmates in shared tasks and projects, contributing to collective efforts.",
            "EFL.3.4.a.20. Recognizes the natural world of Ecuador and the Americas as a shared environment that deserves attention and protection.",
            "EFL.3.4.a.19. Cares for living beings and places mentioned in classroom activities, demonstrating responsibility toward the natural world.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.3.4.d.9. Vocabulary for weather, seasons, and the natural environment: climate, landscapes, ecosystems, plants, and animals of the place and other regions.",
            "EFL.3.2.d.14. Vocabulary for civic and school life: gatherings, celebrations, agreements, roles, shared spaces, rules, and school projects.",
            "EFL.3.4.d.16. Future with will and be going to: use of will for announcements and spontaneous decisions and be going to for plans and intentions in short texts and oral exchanges.",
            "EFL.3.4.d.19. Present continuous for ongoing and planned actions: use for what is happening right now and for near-future arrangements (We are meeting tomorrow).",
            "EFL.3.4.d.26. Functional texts (invitations, warnings, agreements, school notices): short purposeful texts that organize shared life, set expectations, and communicate rights and responsibilities in the school and community.",
            "EFL.3.4.d.30. Collaborative written production: stages and strategies for drafting, revising, and sharing texts in pairs and small groups — planning with notes, writing a first version, giving and receiving short feedback, and presenting a final product.",
            "EFL.3.4.d.35. The natural world of the place and other regions: ecosystems, landscapes, animals, and plants of Ecuador and the Americas, and the practices communities use to care for and live with the natural world.",
          ],
          procedimentales: [
            "EFL.3.2.p.11. Invites and agrees with classmates on tasks, gatherings, and celebrations using basic future forms and sequence connectors.",
            "EFL.3.4.p.35. Drafts illustrated planning outlines for a collaborative school project, deciding what to build, with what materials, with whom, and for what purpose.",
            "EFL.3.4.p.44. Inquires and records information about the natural world of the place and other regions through guided questions and simple note-taking.",
            "EFL.3.4.p.45. Compares the landscapes, climates, plants, and animals of Ecuador with those of other regions using short descriptive sentences and basic comparative forms.",
            "EFL.3.4.p.47. Plans a task, celebration, or school project with classmates by distributing roles, materials, and timelines.",
            "EFL.3.2.p.48. Cooperates with others in collective productions and share orally what has been learned at the close of a stage or project.",
          ],
          actitudinales: [
            "EFL.3.2.a.22. Cooperates with classmates in shared tasks and projects, sustaining the collective effort from beginning to end.",
            "EFL.3.4.a.20. Recognizes the natural world of Ecuador and the Americas as a shared home that deserves attention and protection.",
            "EFL.3.4.a.19. Cares for living beings and places mentioned in classroom activities, demonstrating responsibility toward the natural world.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.1",
    descripcion: "Development of attentive listening and assertiveness through interviews with members of the school community and the local environment, to learn from people with different occupations, knowledge, and life experiences, and to recognize the value of their voices and contributions to the community",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.1. Turn-taking and discourse-management strategies in spoken English: yielding and taking the floor in conversations and discussions.",
            "EFL.4.2.d.2. Opening and closing formulas in formal and informal interviews: self-introductions and leave-takings.",
            "EFL.4.1.d.3. Active listening strategies: note-taking with keywords, confirming comprehension, and requesting repetition.",
            "EFL.4.1.d.5. Formal and informal spoken registers in English: differences in vocabulary and formulas depending on the communicative situation.",
            "EFL.4.1.d.19. Intonation in yes/no questions versus statements: rising and falling patterns and their communicative value.",
            "EFL.4.1.d.21. Weak forms and vowel reduction in English: pronunciation of function words (to, for, of, and, was) in connected speech.",
            "EFL.4.2.d.23. Pronunciation of phonemes that pose difficulty: minimal pairs and long and short vowels.",
            "EFL.4.1.d.32. Listening comprehension strategies: contextual anticipation, keyword identification, and comprehension checks.",
          ],
          procedimentales: [
            "EFL.4.1.p.1. Identifies the main idea and concrete details in recordings, announcements, and interviews on school topics.",
            "EFL.4.2.p.10. Takes part in interviews with community members, asking questions and thanking participants.",
            "EFL.4.2.p.7. Presents information orally on an academic topic with visual support, organizing ideas clearly.",
          ],
          actitudinales: [
            "EFL.4.1.a.1. Listens attentively to others' experiences, opinions, and arguments. Respects turns of speech and the time of those who intervene in discussions and presentations.",
            "EFL.4.1.a.3. Recognizes what each person wishes to share and what they do not, showing discretion and care in interviews.",
            "EFL.4.1.a.16. Uses English with growing confidence in familiar communicative situations, tolerating the inherent uncertainty of the process.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.1. Turn-taking and discourse-management strategies in spoken English: yielding, taking, and holding the floor in conversations, discussions, and interviews.",
            "EFL.4.2.d.2. Opening, closing, and management formulas in formal and informal interviews: self-introductions, requests for clarification, and leave-takings.",
            "EFL.4.1.d.3. Active listening strategies: note-taking with keywords, confirming comprehension, requesting repetition, and paraphrasing what was heard.",
            "EFL.4.1.d.5. Formal and informal spoken registers in English: differences in vocabulary, intonation, and formulas depending on the communicative situation.",
            "EFL.4.1.d.19. Intonation in yes/no and wh- questions versus statements: rising and falling patterns and their communicative value.",
            "EFL.4.1.d.21. Weak forms and vowel reduction in English: pronunciation of function words (to, for, of, and, was) in connected speech. Pronunciation of phonemes that pose difficulty: minimal pairs, long and short vowels, and the consonants /θ/, /ð/, /v/.",
            "EFL.4.1.d.32. Listening comprehension strategies: contextual anticipation, selective listening, keyword identification, and comprehension checks.",
          ],
          procedimentales: [
            "EFL.4.1.p.1. Identifies the main idea and concrete details in recordings, short news items, announcements, and interviews on school and community topics.",
            "EFL.4.2.p.10. Takes part in interviews with community members, asking follow-up questions, requesting clarification, and thanking participants.",
          ],
          actitudinales: [
            "EFL.4.2.a.2. Respects turns of speech and the time of those who intervene in discussions, interviews, and presentations.",
            "EFL.4.1.a.3. Recognizes what each person wishes to share and what they do not, showing discretion and care in interviews and listening circles.",
            "EFL.4.1.a.16. Uses English with growing confidence in new communicative situations, tolerating the inherent uncertainty of the process.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.1. Turn-taking and discourse-management strategies in spoken English: yielding, taking, and holding the floor in conversations, discussions, and interviews.",
            "EFL.4.2.d.2. Opening, closing, and management formulas in formal and informal interviews: self-introductions, requests for clarification, reformulations, and leave-takings.",
            "EFL.4.1.d.3. Active listening strategies: note-taking with keywords, confirming comprehension, requesting repetition, and paraphrasing what was heard.",
            "EFL.4.1.d.5. Formal and informal spoken registers in English: differences in vocabulary, intonation, and formulas depending on the communicative situation.",
            "EFL.4.1.d.19. Intonation in yes/no and wh- questions versus statements: rising and falling patterns and their communicative value.",
            "EFL.4.2.d.23. Pronunciation of phonemes that pose difficulty: minimal pairs, long and short vowels, the consonants /θ/, /ð/, /v/, and frequent diphthongs.",
            "EFL.4.1.d.32. Listening comprehension strategies: contextual anticipation, selective listening, keyword identification, and comprehension checks.",
          ],
          procedimentales: [
            "EFL.4.1.p.1. Identifies the main idea and concrete details in recordings, short news items, announcements, and interviews on school and community topics.",
            "EFL.4.2.p.10. Takes part in interviews with community members, asking follow-up questions, requesting clarification, and thanking participants.",
          ],
          actitudinales: [
            "EFL.4.2.a.2. Respects turns of speech and the time of those who intervene in discussions, interviews, and presentations.",
            "EFL.4.1.a.3. Recognizes what each person wishes to share and what they do not, showing discretion and care in interviews and listening circles.",
            "EFL.4.1.a.16. Uses English with growing confidence in new communicative situations, tolerating the inherent uncertainty of the process.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.2",
    descripcion: "Collaboration in discussion groups on school and community issues through the exchange of ideas and proposals to support collective decision-making with peers, recognizing that agreements are built through dialogue and cooperation",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.1. Turn-taking and discourse-management strategies in spoken English: yielding and taking the floor in conversations and discussions.",
            "EFL.4.1.d.3. Active listening strategies: note-taking with keywords, confirming comprehension, and requesting repetition.",
            "EFL.4.4.d.15. Ways of talking about the future in English: will for predictions and spontaneous decisions, and be going to for plans.",
            "EFL.4.1.d.24. Informational prominence and emphasis: use of sentence stress to highlight new information in spoken discourse.",
            "EFL.4.2.d.28. Active citizenship and collective responsibility: participation in school decisions and actions for the common good.",
          ],
          procedimentales: [
            "EFL.4.1.p.3. Infers basic implicit information in dialogues and conversations, identifying the speaker’s attitude and intention.",
            "EFL.4.2.p.8. Expresses opinions and justify them briefly with relevant reasons in classroom conversations and discussions.",
            "EFL.4.2.p.11. Takes part in discussions and dialogue tables on school topics, contributing proposals and concrete examples.",
            "EFL.4.2.p.13. Uses listening circles to share concerns and experiences with peers, taking turns speaking.",
            "EFL.4.2.p.15. Expresses agreement and disagreement respectfully in classroom debates and discussions.",
            "EFL.4.2.p.46. Projects by responsibly distributing roles, resources, and time. Cooperates with classmates on shared tasks by responsibly distributing roles and resources.",
            "EFL.4.4.p.48. Reflects collectively on the learning processes at the close of a unit, sharing what was learned.",
          ],
          actitudinales: [
            "EFL.4.1.a.1. Listens attentively to others' experiences, opinions, and arguments. Respects turns of speech and the time of those who intervene in discussions and presentations.",
            "EFL.4.2.a.10. Cooperates with classmates on group tasks and acknowledges each person's contributions.",
            "EFL.4.2.a.13. Commits to the classroom's collective agreements and supports peers during shared work.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.1. Turn-taking and discourse-management strategies in spoken English: yielding, taking, and holding the floor in conversations, discussions, and interviews.",
            "EFL.4.1.d.3. Active listening strategies: note-taking with keywords, confirming comprehension, requesting repetition, and paraphrasing what was heard.",
            "EFL.4.4.d.15. Ways of talking about the future in English: will (predictions and spontaneous decisions), be going to (plans), and the present continuous with a future meaning. Informational prominence and emphasis: use of sentence stress to highlight new or contrastive information in spoken discourse.",
            "EFL.4.2.d.28. Active citizenship and collective responsibility: participation in school campaigns, community decisions, and actions for the common good.",
          ],
          procedimentales: [
            "EFL.4.1.p.3. Infers basic implicit information in dialogues and conversations, identifying the speaker’s attitude, intention, and tone. Presents information orally on an academic or community topic with visual support, organizing ideas clearly.",
            "EFL.4.2.p.8. Expresses opinions and justify them briefly with relevant reasons and examples in classroom conversations and discussions.",
            "EFL.4.2.p.11. Sustains discussions and dialogue tables on school and community topics, contributing proposals and concrete examples.",
            "EFL.4.2.p.13. Uses listening circles to share concerns, experiences, and possible solutions with peers, taking turns speaking.",
            "EFL.4.2.p.15. Expresses agreement and disagreement respectfully and propose alternatives in classroom and community debates and discussions.",
            "EFL.4.2.p.46. Cooperates with classmates on shared tasks and projects by responsibly distributing roles, resources, and time.",
            "EFL.4.4.p.48. Reflects collectively on the learning processes at the close of a unit, sharing what was learned and what students still wish to explore.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks, maintains participation, and acknowledges each person's contributions.",
            "EFL.4.2.a.2. Respects turns of speech and the time of those who intervene in discussions, interviews, and presentations.",
            "EFL.4.2.a.13. Commits to the classroom's collective agreements and supports peers when they face difficulties during shared work.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.1. Turn-taking and discourse-management strategies in spoken English: yielding, taking, and holding the floor in conversations, discussions, and interviews.",
            "EFL.4.1.d.3. Active listening strategies: note-taking with keywords, confirming comprehension, requesting repetition, and paraphrasing what was heard.",
            "EFL.4.1.d.24. Informational prominence and emphasis: use of sentence stress to highlight new or contrastive information in spoken discourse.",
            "EFL.4.2.d.28. Active citizenship and collective responsibility: participation in community decisions, school campaigns, and actions for the common good.",
          ],
          procedimentales: [
            "EFL.4.1.p.3. Infers basic implicit information in dialogues and conversations, identifying the speaker’s attitude, intention, and tone.",
            "EFL.4.2.p.7. Presents information orally on an academic or community topic with visual support, organizing ideas clearly.",
            "EFL.4.2.p.8. Expresses opinions and justify them briefly with relevant reasons and examples in classroom conversations and discussions.",
            "EFL.4.2.p.11. Sustains discussions and dialogue tables on school and community topics, contributing proposals and concrete examples.",
            "EFL.4.2.p.13. Uses listening circles to share concerns, experiences, and possible solutions with peers, taking turns speaking.",
            "EFL.4.2.p.15. Expresses agreement and disagreement respectfully and propose alternatives in classroom and community debates and discussions.",
            "EFL.4.2.p.46. Cooperates with classmates on shared tasks and projects by responsibly distributing roles, resources, and time.",
            "EFL.4.4.p.48. Reflects collectively on the learning processes at the close of a unit, sharing what was learned and what students still wish to explore.",
          ],
          actitudinales: [
            "EFL.4.2.a.2. Respects turns of speech and the time of those who intervene in discussions, interviews, and presentations.",
            "EFL.4.2.a.10. Cooperates with classmates on group tasks, maintains participation, and acknowledges each person's contributions.",
            "EFL.4.2.a.13. Commits to the classroom's collective agreements and supports peers when they face difficulties during shared work.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.3",
    descripcion: "Exchange of family and everyday experiences through accounts, descriptions, and conversations with follow-up questions, to share how life is experienced in different families and communities in Ecuador and around the world, valuing diversity in family structures and ways of living",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.1.d.21. Weak forms and vowel reduction in English: pronunciation of function words (to, for, of, and, was) in connected speech.",
            "EFL.4.2.d.6. Oral narrative resources in English: basic sequence connectors and time markers for personal accounts.",
            "EFL.4.4.d.13. Past tenses in English: simple past (regular and irregular) and past continuous.",
            "EFL.4.3.d.26. Diversity of cultural traditions and ways of life in communities across Asia, Africa, and the Americas: celebrations and foods.",
            "EFL.4.3.d.31. Linguistic mediation: strategies for reformulating and simplifying information across languages or for different audiences.",
          ],
          procedimentales: [
            "EFL.4.2.p.5. Narrates family and personal experiences using past tenses, time markers, and appropriate sequence connectors.",
            "EFL.4.2.p.6. Describes people, objects, and places with concrete details.",
            "EFL.4.4.p.36. Paraphrases information read or heard in English from another language of the classroom or the community.",
            "EFL.4.4.p.36. Paraphrases information read or heard in English from another language of the classroom or the community.",
            "EFL.4.3.p.42. Contrasts English with languages known to identify similarities and differences that facilitate comprehension.",
            "EFL.4.2.p.45. Compares and describe natural environments and communities from different contexts of the world using connected descriptions.",
          ],
          actitudinales: [
            "EFL.4.2.a.4. Shows curiosity about ways of life and traditions in different communities of the world.",
            "EFL.4.1.a.5. Values the varieties of English and the languages of the place as equally valid resources for communication and learning in the classroom.",
            "EFL.4.3.a.11. Acts as a mediator between languages and people, facilitating mutual understanding in the classroom.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.1.d.21. Weak forms and vowel reduction in English: pronunciation of function words (to, for, of, and, was) in connected speech. Oral narrative resources in English: sequence connectors, time markers, and formulas for personal accounts.",
            "EFL.4.4.d.13. Past tenses in English: simple past (regular and irregular), past continuous, and the contrast between completed actions and actions in progress.",
            "EFL.4.3.d.26. Diversity of cultural traditions and ways of life in communities across Asia, Africa, the Pacific, and the Americas: celebrations, foods, and forms of organization.",
            "EFL.4.3.d.31. Linguistic mediation: strategies for reformulating, paraphrasing, and simplifying information across languages or for different audiences.",
          ],
          procedimentales: [
            "EFL.4.2.p.5. Narrates family, personal, or fictional experiences using past tenses, time markers, and appropriate sequence connectors.",
            "EFL.4.2.p.6. Describes people, objects, places, and community processes with concrete details and comparisons.",
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.3.p.42. Contrasts English with languages known to identify similarities and differences that facilitate comprehension and production.",
            "EFL.4.2.p.45. Compares and describe natural environments, communities, and ways of life from different contexts of the world using connected descriptions.",
          ],
          actitudinales: [
            "EFL.4.2.a.4. Shows curiosity about ways of life, traditions, and ways of organizing knowledge in different communities of the world.",
            "EFL.4.1.a.5. Values the varieties of English and the languages of the place as equally valid resources for communication and learning in the school community.",
            "EFL.4.3.a.11. Acts as a mediator between languages, people, or perspectives, facilitating mutual understanding in the classroom.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.6. Oral narrative resources in English: sequence connectors, time markers, and formulas for personal and fictional accounts.",
            "EFL.4.4.d.13. Past tenses in English: simple past (regular and irregular), past continuous, and the contrast between completed actions and actions in progress.",
            "EFL.4.3.d.26. Diversity of cultural traditions and ways of life in communities across Asia, Africa, the Pacific, and the Americas: celebrations, foods, and forms of organization.",
            "EFL.4.3.d.31. Linguistic mediation: strategies for reformulating, paraphrasing, and simplifying information across languages or for different audiences.",
          ],
          procedimentales: [
            "EFL.4.2.p.5. Narrates family, personal, or fictional experiences using past tenses, time markers, and appropriate sequence connectors.",
            "EFL.4.2.p.6. Describes people, objects, places, and community processes with concrete details and comparisons.",
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.3.p.42. Contrasts English with languages known to identify similarities and differences that facilitate comprehension and production.",
            "EFL.4.2.p.45. Compares and describe natural environments, communities, and ways of life from different contexts of the world using connected descriptions.",
          ],
          actitudinales: [
            "EFL.4.2.a.4. Shows curiosity about ways of life, traditions, and ways of organizing knowledge in different communities of the world.",
            "EFL.4.1.a.5. Values the varieties of English and the languages of the place as equally valid resources for communication and learning.",
            "EFL.4.3.a.11. Acts as a mediator between languages, people, or perspectives, facilitating mutual understanding in the classroom.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.4",
    descripcion: "Critical comparison of short audiovisual news reports on the same event, analyzing sources, perspectives, and voices to understand how information varies with the narrator, developing critical awareness of media and information",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.1.d.3. Active listening strategies: note-taking with keywords, confirming comprehension, and requesting repetition.",
            "EFL.4.1.d.19. Intonation in yes/no questions versus statements: rising and falling patterns and their communicative value.",
            "EFL.4.1.d.32. Listening comprehension strategies: contextual anticipation, keyword identification, and comprehension checks.",
            "EFL.4.1.d.24. Informational prominence and emphasis: use of sentence stress to highlight new information in spoken discourse.",
            "EFL.4.3.d.30. Media and informational perspectives: how different outlets present the same event, and the notion of source.",
          ],
          procedimentales: [
            "EFL.4.1.p.1. Identifies the main idea and concrete details in recordings, announcements, and interviews on school topics.",
            "EFL.4.1.p.2. Distinguishes perspectives and voices in short audiovisual reports on the same event, recognizing differences in how the information is presented.",
            "EFL.4.1.p.4. Follows sequences of oral instructions and short videos to complete tasks, taking notes using keywords.",
            "EFL.4.2.p.14. Compares two texts or sources on the same topic orally, pointing out similarities and differences.",
            "EFL.4.4.p.32. Writes short opinion paragraphs in English with a claim and reasons.",
          ],
          actitudinales: [
            "EFL.4.2.a.6. Is willing to consider viewpoints different from their own.",
            "EFL.4.3.a.9. Is willing to compare information from different sources, recognizing that not everything written or published is equally reliable.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.1.d.3. Active listening strategies: note-taking with keywords, confirming comprehension, requesting repetition, and paraphrasing what was heard.",
            "EFL.4.1.d.19. Intonation in yes/no and wh- questions versus statements: rising and falling patterns and their communicative value.",
            "EFL.4.1.d.32. Listening comprehension strategies: contextual anticipation, selective listening, keyword identification, and comprehension checks.",
            "EFL.4.1.d.24. Informational prominence and emphasis: use of sentence stress to highlight new or contrastive information in spoken discourse.",
            "EFL.4.3.d.30. Media and informational perspectives: how different outlets present the same event, and the notions of source, bias, and credibility.",
          ],
          procedimentales: [
            "EFL.4.1.p.1. Identifies the main idea and concrete details in recordings, short news items, announcements, and interviews on school and community topics.",
            "EFL.4.1.p.2. Distinguishes perspectives, voices, and approaches in short audiovisual reports on the same event, recognizing differences in how the information is presented.",
            "EFL.4.1.p.4. Follows sequences of oral instructions and short videos to complete tasks, taking notes using keywords and checking comprehension.",
            "EFL.4.2.p.14. Compares two texts, sources, or perspectives on the same topic orally, citing evidence to point out similarities and differences.",
            "EFL.4.4.p.32. Writes short opinion paragraphs in English with a claim, reasons, and a supporting example or piece of evidence.",
          ],
          actitudinales: [
            "EFL.4.2.a.6. Is willing to revise their own perspectives when encountering viewpoints different from their own.",
            "EFL.4.3.a.9. Is willing to compare and question information from different sources, recognizing that not everything written or published is equally reliable.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.1.d.3. Active listening strategies: note-taking with keywords, confirming comprehension, requesting repetition, and paraphrasing what was heard.",
            "EFL.4.1.d.19. Intonation in yes/no and wh- questions versus statements: rising and falling patterns and their communicative value.",
            "EFL.4.1.d.32. Listening comprehension strategies: contextual anticipation, selective listening, keyword identification, and comprehension checks.",
            "EFL.4.1.d.24. Informational prominence and emphasis: use of sentence stress to highlight new or contrastive information in spoken discourse.",
            "EFL.4.3.d.30. Media and informational perspectives: how different outlets present the same event, and the notions of source, bias, and credibility.",
          ],
          procedimentales: [
            "EFL.4.1.p.1. Identifies the main idea and concrete details in recordings, short news items, announcements, and interviews on school and community topics.",
            "EFL.4.1.p.2. Distinguishes perspectives, voices, and approaches in short audiovisual reports on the same event, recognizing differences in how the information is presented.",
            "EFL.4.1.p.4. Follows sequences of oral instructions and short videos to complete tasks, taking notes using keywords and checking comprehension.",
            "EFL.4.2.p.14. Compares two texts, sources, or perspectives on the same topic orally, citing evidence to point out similarities and differences.",
            "EFL.4.4.p.32. Writes short opinion paragraphs in English with a claim, reasons, and a supporting example or piece of evidence.",
          ],
          actitudinales: [
            "EFL.4.2.a.6. Is willing to revise their own perspectives when encountering viewpoints different from their own.",
            "EFL.4.3.a.9. Is willing to compare and question information from different sources, recognizing that not everything written or published is equally reliable.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.5",
    descripcion: "Expression of awareness of everyday challenges in pre-adolescent life through conversations and dialogue circles, to share concerns, experiences, and possible solutions with peers, recognizing how daily conditions can affect health and well-being",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.1. Turn-taking and discourse-management strategies in spoken English: yielding and taking the floor in conversations and discussions.",
            "EFL.4.2.d.4. Formulas to express complaints and claims assertively: description of the problem and expression of needs.",
            "EFL.4.4.d.16. First conditional: structure: If + simple present + will; used to express possible consequences.",
            "EFL.4.4.d.27. Rights of young people: rights of participation, protection, and well-being in school contexts.",
            "EFL.4.4.d.36. Work; and rights. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; and the environment.",
          ],
          procedimentales: [
            "EFL.4.1.p.3. Infers basic implicit information in dialogues and conversations, identifying the speaker’s attitude and intention.",
            "EFL.4.2.p.11. Takes part in discussions and dialogue tables on school topics, contributing proposals and concrete examples.",
            "EFL.4.2.p.13. Uses listening circles to share concerns and experiences with peers, taking turns speaking.",
            "EFL.4.2.p.12. Expresses complaints and claims about products and services by describing the problem in an assertive yet respectful manner.",
            "EFL.4.2.p.43. Describes practices of care for the body and health in short presentations, using appropriate vocabulary.",
          ],
          actitudinales: [
            "EFL.4.1.a.1. Listens attentively to others' experiences, opinions, and arguments. Recognizes what each person wishes to share and what they do not, showing discretion and care in interviews.",
            "EFL.4.2.a.12. Offers and requests help with confidence, recognizing the importance of collaboration in learning.",
            "EFL.4.4.a.19. Cares for their physical and emotional well-being and shows empathy for the experiences of peers.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.1. Turn-taking and discourse-management strategies in spoken English: yielding, taking, and holding the floor in conversations, discussions, and interviews.",
            "EFL.4.2.d.4. Formulas to express complaints and claims assertively: description of the problem, expression of needs, and proposal of a solution.",
            "EFL.4.4.d.16. First conditional: structure: If + simple present + will; used to express possible consequences and prevention situations.",
            "EFL.4.4.d.27. Rights of young people: Convention on the Rights of the Child, rights of participation, protection, and well-being in school and community contexts.",
            "EFL.4.4.d.36. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; the environment; and work.",
          ],
          procedimentales: [
            "EFL.4.1.p.3. Infers basic implicit information in dialogues and conversations, identifying the speaker’s attitude, intention, and tone. Sustains discussions and dialogue tables on school and community topics, contributing proposals and concrete examples.",
            "EFL.4.2.p.13. Uses listening circles to share concerns, experiences, and possible solutions with peers, taking turns speaking.",
            "EFL.4.2.p.12. Expresses complaints and claims about products and services by clearly describing the problem and proposing a solution in an assertive yet respectful manner.",
            "EFL.4.2.p.43. Describes practices of care for the body, health, and emotional well-being in short presentations, using appropriate vocabulary.",
          ],
          actitudinales: [
            "EFL.4.1.a.3. Recognizes what each person wishes to share and what they do not, showing discretion and care in interviews and listening circles.",
            "EFL.4.2.a.12. Offers and requests help with confidence, recognizing that collaboration is an essential part of learning.",
            "EFL.4.4.a.19. Cares for their physical and emotional well-being and shows empathy for the experiences of peers who face everyday challenges.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.1. Turn-taking and discourse-management strategies in spoken English: yielding, taking, and holding the floor in conversations, discussions, and interviews.",
            "EFL.4.2.d.4. Formulas to express complaints and claims assertively: description of the problem, expression of needs, and proposal of a solution.",
            "EFL.4.4.d.16. First conditional: structure: If + simple present + will; used to express possible consequences and prevention situations.",
            "EFL.4.4.d.27. Rights of young people: Convention on the Rights of the Child, rights of participation, protection, and well-being in school and community contexts.",
            "EFL.4.4.d.36. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; the environment; work; and rights.",
          ],
          procedimentales: [
            "EFL.4.1.p.3. Infers basic implicit information in dialogues and conversations, identifying the speaker’s attitude, intention, and tone.",
            "EFL.4.2.p.11. Sustains discussions and dialogue tables on school and community topics, contributing proposals and concrete examples.",
            "EFL.4.2.p.13. Uses listening circles to share concerns, experiences, and possible solutions with peers, taking turns speaking.",
            "EFL.4.2.p.12. Expresses complaints and claims about products and services by clearly describing the problem and proposing a solution in an assertive yet respectful manner.",
            "EFL.4.2.p.43. Describes practices of care for the body, health, and emotional well-being in short presentations, using appropriate vocabulary.",
          ],
          actitudinales: [
            "EFL.4.1.a.3. Recognizes what each person wishes to share and what they do not, showing discretion and care in interviews and listening circles.",
            "EFL.4.2.a.12. Offers and requests help with confidence, recognizing that collaboration is an essential part of learning.",
            "EFL.4.4.a.19. Cares for their physical and emotional well-being and shows empathy for the experiences of peers who face everyday challenges.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.6",
    descripcion: "Creative oral expression through improvisation based on prompts, images, and unexpected situations, using role-plays and spontaneous interaction to build confidence and explore English creatively and flexibly",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.1.d.5. Formal and informal spoken registers in English: differences in vocabulary and formulas depending on the communicative situation.",
            "EFL.4.1.d.19. Intonation in yes/no questions versus statements: rising and falling patterns and their communicative value.",
            "EFL.4.1.d.21. Weak forms and vowel reduction in English: pronunciation of function words (to, for, of, and, was) in connected speech.",
            "EFL.4.2.d.23. Pronunciation of phonemes that pose difficulty: minimal pairs and long and short vowels.",
            "EFL.4.2.d.6. Oral narrative resources in English: basic sequence connectors and time markers for personal accounts.",
            "EFL.4.1.d.20. Word stress in vocabulary: stressed syllables in two-syllable nouns and verbs.",
          ],
          procedimentales: [
            "EFL.4.2.p.5. Narrates family and personal experiences using past tenses, time markers, and appropriate sequence connectors.",
            "EFL.4.2.p.9. Improvises short oral interactions based on images and role plays, exploring English creatively.",
            "EFL.4.1.p.38. Relies on images and gestures to sustain comprehension and production in English when vocabulary is insufficient.",
          ],
          actitudinales: [
            "EFL.4.1.a.16. Uses English with growing confidence in familiar communicative situations, tolerating the inherent uncertainty of the process.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.1.d.5. Formal and informal spoken registers in English: differences in vocabulary, intonation, and formulas depending on the communicative situation.",
            "EFL.4.1.d.19. Intonation in yes/no and wh- questions versus statements: rising and falling patterns and their communicative value.",
            "EFL.4.1.d.21. Weak forms and vowel reduction in English: pronunciation of function words (to, for, of, and, was) in connected speech. Pronunciation of phonemes that pose difficulty: minimal pairs, long and short vowels, and the consonants /θ/, /ð/, /v/.",
            "EFL.4.2.d.6. Oral narrative resources in English: sequence connectors, time markers, and formulas for personal accounts.",
            "EFL.4.1.d.20. Word stress in vocabulary: stressed syllables in two-syllable nouns and verbs, and stress shift driven by grammatical function.",
          ],
          procedimentales: [
            "EFL.4.2.p.5. Narrates family, personal, or fictional experiences using past tenses, time markers, and appropriate sequence connectors.",
            "EFL.4.2.p.9. Improvises short oral interactions based on images, unexpected situations, and role plays, exploring English creatively.",
            "EFL.4.1.p.38. Relies on images, diagrams, and gestures to sustain comprehension and production in English when vocabulary is insufficient.",
          ],
          actitudinales: [
            "EFL.4.1.a.16. Uses English with growing confidence in new communicative situations, tolerating the inherent uncertainty of the process.",
            "EFL.4.2.a.22. Enjoys creative improvisation and play with language as ways of exploring English with confidence.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.1.d.5. Formal and informal spoken registers in English: differences in vocabulary, intonation, and formulas depending on the communicative situation.",
            "EFL.4.1.d.19. Intonation in yes/no and wh- questions versus statements: rising and falling patterns and their communicative value.",
            "EFL.4.2.d.23. Pronunciation of phonemes that pose difficulty: minimal pairs, long and short vowels, the consonants /θ/, /ð/, /v/, and frequent diphthongs.",
            "EFL.4.2.d.6. Oral narrative resources in English: sequence connectors, time markers, and formulas for personal and fictional accounts.",
            "EFL.4.1.d.20. Word stress in vocabulary: stressed syllables in two-syllable nouns and verbs, and stress shift driven by grammatical function.",
          ],
          procedimentales: [
            "EFL.4.2.p.5. Narrates family, personal, or fictional experiences using past tenses, time markers, and appropriate sequence connectors.",
            "EFL.4.2.p.9. Improvises short oral interactions based on images, unexpected situations, and role plays, exploring English creatively.",
            "EFL.4.1.p.38. Relies on images, diagrams, gestures, and visual supports to sustain comprehension and production in English when vocabulary is insufficient.",
          ],
          actitudinales: [
            "EFL.4.1.a.16. Uses English with growing confidence in new communicative situations, tolerating the inherent uncertainty of the process.",
            "EFL.4.4.a.15. Accepts error as part of the learning process and revises their own production with a willingness to improve.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.7",
    descripcion: "Assertive and respectful communication when expressing complaints and claims about products and services, including problem descriptions and proposed solutions, to communicate concerns clearly while recognizing complaints as legitimate expressions of consumer rights and responsibilities",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.2. Opening and closing formulas in formal and informal interviews: self-introductions and leave-takings.",
            "EFL.4.1.d.5. Formal and informal spoken registers in English: differences in vocabulary and formulas depending on the communicative situation.",
            "EFL.4.1.d.24. Informational prominence and emphasis: use of sentence stress to highlight new information in spoken discourse.",
            "EFL.4.2.d.4. Formulas to express complaints and claims assertively: description of the problem and expression of needs.",
            "EFL.4.4.d.36. Work; and rights. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; and the environment.",
          ],
          procedimentales: [
            "EFL.4.1.p.3. Infers basic implicit information in dialogues and conversations, identifying the speaker’s attitude and intention.",
            "EFL.4.2.p.15. Expresses agreement and disagreement respectfully in classroom debates and discussions.",
            "EFL.4.2.p.12. Expresses complaints and claims about products and services by describing the problem in an assertive yet respectful manner.",
          ],
          actitudinales: [
            "EFL.4.2.a.2. Respects turns of speech and the time of those who intervene in discussions and presentations.",
            "EFL.4.4.a.19. Cares for their physical and emotional well-being and shows empathy for the experiences of peers.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.2. Opening, closing, and management formulas in formal and informal interviews: self-introductions, requests for clarification, and leave-takings.",
            "EFL.4.1.d.5. Formal and informal spoken registers in English: differences in vocabulary, intonation, and formulas depending on the communicative situation.",
            "EFL.4.1.d.24. Informational prominence and emphasis: use of sentence stress to highlight new or contrastive information in spoken discourse.",
            "EFL.4.2.d.4. Formulas to express complaints and claims assertively: description of the problem, expression of needs, and proposal of a solution.",
            "EFL.4.4.d.36. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; the environment; and work.",
          ],
          procedimentales: [
            "EFL.4.1.p.3. Infers basic implicit information in dialogues and conversations, identifying the speaker’s attitude, intention, and tone. Expresses agreement and disagreement respectfully and propose alternatives in classroom and community debates and discussions.",
            "EFL.4.2.p.12. Expresses complaints and claims about products and services by clearly describing the problem and proposing a solution in an assertive yet respectful manner.",
          ],
          actitudinales: [
            "EFL.4.2.a.2. Respects turns of speech and the time of those who intervene in discussions, interviews, and presentations.",
            "EFL.4.4.a.19. Cares for their physical and emotional well-being and shows empathy for the experiences of peers who face everyday challenges.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.2. Opening, closing, and management formulas in formal and informal interviews: self-introductions, requests for clarification, reformulations, and leave-takings.",
            "EFL.4.1.d.5. Formal and informal spoken registers in English: differences in vocabulary, intonation, and formulas depending on the communicative situation.",
            "EFL.4.1.d.24. Informational prominence and emphasis: use of sentence stress to highlight new or contrastive information in spoken discourse.",
            "EFL.4.2.d.4. Formulas to express complaints and claims assertively: description of the problem, expression of needs, and proposal of a solution.",
            "EFL.4.4.d.36. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; the environment; work; and rights.",
          ],
          procedimentales: [
            "EFL.4.1.p.3. Infers basic implicit information in dialogues and conversations, identifying the speaker’s attitude, intention, and tone.",
            "EFL.4.2.p.15. Expresses agreement and disagreement respectfully and propose alternatives in classroom and community debates and discussions.",
            "EFL.4.2.p.12. Expresses complaints and claims about products and services by clearly describing the problem and proposing a solution in an assertive yet respectful manner.",
          ],
          actitudinales: [
            "EFL.4.2.a.2. Respects turns of speech and the time of those who intervene in discussions, interviews, and presentations.",
            "EFL.4.4.a.19. Cares for their physical and emotional well-being and shows empathy for the experiences of peers who face everyday challenges.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.8",
    descripcion: "Narration of surprising, unexpected, or unusual situations through personal and fictional stories to share experiences with different audiences, fostering curiosity and attention to everyday events",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.2. Opening and closing formulas in formal and informal interviews: self-introductions and leave-takings.",
            "EFL.4.1.d.32. Listening comprehension strategies: contextual anticipation, keyword identification, and comprehension checks.",
            "EFL.4.2.d.6. Oral narrative resources in English: basic sequence connectors and time markers for personal accounts.",
            "EFL.4.1.d.20. Word stress in vocabulary: stressed syllables in two-syllable nouns and verbs.",
            "EFL.4.1.d.22. Rhythm and timing in English: English as a stress-timed language and rhythmic patterns in statements.",
          ],
          procedimentales: [
            "EFL.4.2.p.5. Narrates family and personal experiences using past tenses, time markers, and appropriate sequence connectors.",
            "EFL.4.2.p.9. Improvises short oral interactions based on images and role plays, exploring English creatively.",
          ],
          actitudinales: [
            "EFL.4.4.a.24. Recognizes writing and narration as ways of constructing identity.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.2. Opening, closing, and management formulas in formal and informal interviews: self-introductions, requests for clarification, and leave-takings.",
            "EFL.4.1.d.32. Listening comprehension strategies: contextual anticipation, selective listening, keyword identification, and comprehension checks.",
            "EFL.4.2.d.6. Oral narrative resources in English: sequence connectors, time markers, and formulas for personal accounts.",
            "EFL.4.1.d.20. Word stress in vocabulary: stressed syllables in two-syllable nouns and verbs, and stress shift driven by grammatical function.",
            "EFL.4.1.d.22. Rhythm and timing in English: English as a stress-timed language, and rhythmic patterns in statements and questions.",
          ],
          procedimentales: [
            "EFL.4.2.p.5. Narrates family, personal, or fictional experiences using past tenses, time markers, and appropriate sequence connectors.",
            "EFL.4.2.p.9. Improvises short oral interactions based on images, unexpected situations, and role plays, exploring English creatively.",
          ],
          actitudinales: [
            "EFL.4.2.a.22. Enjoys creative improvisation and play with language as ways of exploring English with confidence. Recognizes writing and narration as ways of constructing identity and contributing to the community's collective memory.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.2. Opening, closing, and management formulas in formal and informal interviews: self-introductions, requests for clarification, reformulations, and leave-takings.",
            "EFL.4.1.d.32. Listening comprehension strategies: contextual anticipation, selective listening, keyword identification, and comprehension checks.",
            "EFL.4.2.d.6. Oral narrative resources in English: sequence connectors, time markers, and formulas for personal and fictional accounts.",
            "EFL.4.1.d.20. Word stress in vocabulary: stressed syllables in two-syllable nouns and verbs, and stress shift driven by grammatical function.",
            "EFL.4.1.d.22. Rhythm and timing in English: English as a stress-timed language, and rhythmic patterns in statements and questions.",
          ],
          procedimentales: [
            "EFL.4.2.p.5. Narrates family, personal, or fictional experiences using past tenses, time markers, and appropriate sequence connectors.",
            "EFL.4.2.p.9. Improvises short oral interactions based on images, unexpected situations, and role plays, exploring English creatively.",
          ],
          actitudinales: [
            "EFL.4.4.a.15. Accepts error as part of the learning process and revises their own production with a willingness to improve.",
            "EFL.4.4.a.24. Recognizes writing and narration as ways of constructing identity and contributing to the community's collective memory.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.9",
    descripcion: "Development of multiple perspectives through comparative reading of short articles from general-interest magazines in different contexts, identifying the topic, viewpoints, and supporting ideas to understand how issues are experienced differently across communities",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.26. Diversity of cultural traditions and ways of life in communities across Asia, Africa, and the Americas: celebrations and foods.",
            "EFL.4.3.d.31. Linguistic mediation: strategies for reformulating and simplifying information across languages or for different audiences.",
            "EFL.4.3.d.7. Written informational and outreach genres: informational texts and bulletins.",
            "EFL.4.4.d.18. Connectors and discourse markers: contrast (however, although), cause (because, since), and addition (in addition).",
            "EFL.4.3.d.33. Reading comprehension strategies: skimming and scanning.",
          ],
          procedimentales: [
            "EFL.4.4.p.36. Paraphrases information read or heard in English from another language of the classroom or the community.",
            "EFL.4.4.p.36. Paraphrases information read or heard in English from another language of the classroom or the community.",
            "EFL.4.2.p.45. Compares and describe natural environments and communities from different contexts of the world using connected descriptions.",
            "EFL.4.1.p.2. Distinguishes perspectives and voices in short audiovisual reports on the same event, recognizing differences in how the information is presented.",
            "EFL.4.2.p.14. Compares two texts or sources on the same topic orally, pointing out similarities and differences.",
            "EFL.4.3.p.16. Reads general-interest magazine articles, identifying the topic and the author’s perspectives.",
            "EFL.4.3.p.22. Summarizes short informational texts in English in a short paragraph, capturing the essential ideas.",
            "EFL.4.4.p.27. Writes summaries and personal opinions about television content and series, expressing points of view.",
          ],
          actitudinales: [
            "EFL.4.2.a.4. Shows curiosity about ways of life and traditions in different communities of the world.",
            "EFL.4.3.a.11. Acts as a mediator between languages and people, facilitating mutual understanding in the classroom.",
            "EFL.4.2.a.6. Is willing to consider viewpoints different from their own.",
            "EFL.4.3.a.7. Shows interest in exploring a variety of English text genres, including articles, biographies, and narratives.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.26. Diversity of cultural traditions and ways of life in communities across Asia, Africa, the Pacific, and the Americas: celebrations, foods, and forms of organization.",
            "EFL.4.3.d.31. Linguistic mediation: strategies for reformulating, paraphrasing, and simplifying information across languages or for different audiences.",
            "EFL.4.3.d.7. Written informational and outreach genres: magazine articles, informational texts, and bulletins.",
            "EFL.4.4.d.18. Connectors and discourse markers: contrast (however, although), cause (because, since, due to), consequence (therefore, as a result), and addition (in addition, furthermore). Reading comprehension strategies: skimming and scanning, and recognition of text structure.",
          ],
          procedimentales: [
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.2.p.45. Compares and describe natural environments, communities, and ways of life from different contexts of the world using connected descriptions.",
            "EFL.4.1.p.2. Distinguishes perspectives, voices, and approaches in short audiovisual reports on the same event, recognizing differences in how the information is presented.",
            "EFL.4.2.p.14. Compares two texts, sources, or perspectives on the same topic orally, citing evidence to point out similarities and differences.",
            "EFL.4.3.p.16. Reads general-interest magazine articles, identifying the topic, the author’s perspectives, and the examples that support the ideas.",
            "EFL.4.3.p.22. Summarizes informational or literary texts in English in a short paragraph, capturing the essential ideas and using one’s own words.",
            "EFL.4.4.p.27. Writes summaries and personal opinions about television content, series, and online materials, expressing informed points of view.",
          ],
          actitudinales: [
            "EFL.4.2.a.4. Shows curiosity about ways of life, traditions, and ways of organizing knowledge in different communities of the world.",
            "EFL.4.3.a.11. Acts as a mediator between languages, people, or perspectives, facilitating mutual understanding in the classroom.",
            "EFL.4.2.a.6. Is willing to revise their own perspectives when encountering viewpoints different from their own.",
            "EFL.4.3.a.7. Shows interest in exploring a variety of English text genres, including articles, biographies, narratives, infographics, and literary texts.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.26. Diversity of cultural traditions and ways of life in communities across Asia, Africa, the Pacific, and the Americas: celebrations, foods, and forms of organization.",
            "EFL.4.3.d.31. Linguistic mediation: strategies for reformulating, paraphrasing, and simplifying information across languages or for different audiences.",
            "EFL.4.3.d.7. Written informational and outreach genres: magazine articles, informational texts, bulletins, and community announcements.",
            "EFL.4.3.d.33. Reading comprehension strategies: skimming and scanning, recognition of text structure, and basic inference.",
          ],
          procedimentales: [
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.2.p.45. Compares and describe natural environments, communities, and ways of life from different contexts of the world using connected descriptions.",
            "EFL.4.1.p.2. Distinguishes perspectives, voices, and approaches in short audiovisual reports on the same event, recognizing differences in how the information is presented.",
            "EFL.4.2.p.14. Compares two texts, sources, or perspectives on the same topic orally, citing evidence to point out similarities and differences.",
            "EFL.4.3.p.16. Reads general-interest magazine articles, identifying the topic, the author’s perspectives, and the examples that support the ideas.",
            "EFL.4.3.p.22. Summarizes informational or literary texts in English in a short paragraph, capturing the essential ideas and using one’s own words.",
            "EFL.4.4.p.27. Writes summaries and personal opinions about television content, series, and online materials, expressing informed points of view.",
          ],
          actitudinales: [
            "EFL.4.2.a.4. Shows curiosity about ways of life, traditions, and ways of organizing knowledge in different communities of the world.",
            "EFL.4.3.a.11. Acts as a mediator between languages, people, or perspectives, facilitating mutual understanding in the classroom.",
            "EFL.4.2.a.6. Is willing to revise their own perspectives when encountering viewpoints different from their own.",
            "EFL.4.3.a.7. Shows interest in exploring a variety of English text genres, including articles, biographies, narratives, infographics, and literary texts.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.10",
    descripcion: "Expansion of historical understanding by reading short biographical texts about diverse individuals, using timelines to identify key events and motivations, and appreciating diverse life experiences and trajectories",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.13. Past tenses in English: simple past (regular and irregular) and past continuous.",
            "EFL.4.3.d.8. Short biographical text: chronology, key events, and vocabulary of life stages.",
            "EFL.4.4.d.14. Present perfect simple: used to connect the past and present, with time markers (already, yet, just, ever, never).",
            "EFL.4.3.d.29. Local narrative and historical heritage: collective memories and events that shape a place's identity.",
          ],
          procedimentales: [
            "EFL.4.2.p.10. Takes part in interviews with community members, asking questions and thanking participants.",
            "EFL.4.3.p.17. Relationships. Reads short biographical texts about diverse people and identify key events and motivations.",
            "EFL.4.4.p.30. Writes a short school report on a local history topic by consulting guided sources and organizing the information.",
          ],
          actitudinales: [
            "EFL.4.1.a.3. Recognizes what each person wishes to share and what they do not, showing discretion and care in interviews.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.13. Past tenses in English: simple past (regular and irregular), past continuous, and the contrast between completed actions and actions in progress.",
            "EFL.4.3.d.8. Short biographical text: chronology, key events, motivations, use of timelines, and vocabulary of life stages.",
            "EFL.4.4.d.14. Present perfect simple: used to connect the past and present, with time markers (already, yet, just, ever, never), and to contrast with the simple past. Local narrative and historical heritage: collective memories, events that shape a place's identity, and diversity of voices and perspectives.",
          ],
          procedimentales: [
            "EFL.4.2.p.10. Takes part in interviews with community members, asking follow-up questions, requesting clarification, and thanking participants.",
            "EFL.4.3.p.17. Reads short biographical texts about diverse people and identify key events, motivations, and cause-and-effect relationships.",
            "EFL.4.4.p.30. Writes a short school report on a local history topic by consulting guided sources, organizing the information, and revising with peers.",
          ],
          actitudinales: [
            "EFL.4.1.a.3. Recognizes what each person wishes to share and what they do not, showing discretion and care in interviews and listening circles.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.13. Past tenses in English: simple past (regular and irregular), past continuous, and the contrast between completed actions and actions in progress.",
            "EFL.4.3.d.8. Short biographical text: structure (chronology, key events, motivations), use of timelines, and vocabulary of life stages.",
            "EFL.4.3.d.29. Local narrative and historical heritage: collective memories, events that shape a place's identity, and the diversity of voices and perspectives.",
          ],
          procedimentales: [
            "EFL.4.2.p.10. Takes part in interviews with community members, asking follow-up questions, requesting clarification, and thanking participants.",
            "EFL.4.3.p.17. Reads short biographical texts about diverse people and identify key events, motivations, and cause-and-effect relationships.",
            "EFL.4.4.p.30. Writes a short school report on a local history topic by consulting guided sources, organizing the information, and revising with peers.",
          ],
          actitudinales: [
            "EFL.4.1.a.3. Recognizes what each person wishes to share and what they do not, showing discretion and care in interviews and listening circles.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.11",
    descripcion: "Reading informational texts on science, culture, and everyday topics by predicting, identifying main and supporting ideas, and summarizing to organize and share information that deepens understanding of the world",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.28. Active citizenship and collective responsibility: participation in school decisions and actions for the common good.",
            "EFL.4.3.d.7. Written informational and outreach genres: informational texts and bulletins.",
            "EFL.4.4.d.18. Connectors and discourse markers: contrast (however, although), cause (because, since), and addition (in addition).",
            "EFL.4.3.d.33. Reading comprehension strategies: skimming and scanning.",
            "EFL.4.4.d.17. Simple passive voice: simple present in the passive, used in informational and science-outreach texts.",
            "EFL.4.4.d.35. Learning-to-learn strategies: use of dictionaries to expand lexis and self-assessment.",
          ],
          procedimentales: [
            "EFL.4.2.p.13. Uses listening circles to share concerns and experiences with peers, taking turns speaking.",
            "EFL.4.4.p.48. Reflects collectively on the learning processes at the close of a unit, sharing what was learned.",
            "EFL.4.3.p.16. Reads general-interest magazine articles, identifying the topic and the author’s perspectives.",
            "EFL.4.3.p.22. Summarizes short informational texts in English in a short paragraph, capturing the essential ideas.",
            "EFL.4.3.p.18. Predicts the content of informational texts based on the title and images, and identify the main idea.",
            "EFL.4.4.p.35. Produces short texts that combine information from two sources, organize the data, and cite the sources in a basic way.",
            "EFL.4.1.p.37. Conveying the main ideas to a new audience. Summarizes in English short texts or conversations, conveying the main ideas to a familiar audience.",
            "EFL.4.4.p.39. Uses bilingual online dictionaries to expand vocabulary and verify the use of new words in context.",
          ],
          actitudinales: [
            "EFL.4.3.a.9. Is willing to compare information from different sources, recognizing that not everything written or published is equally reliable.",
            "EFL.4.3.a.7. Shows interest in exploring a variety of English text genres, including articles, biographies, and narratives.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.28. Active citizenship and collective responsibility: participation in school campaigns, community decisions, and actions for the common good.",
            "EFL.4.3.d.7. Written informational and outreach genres: magazine articles, informational texts, and bulletins.",
            "EFL.4.4.d.18. Connectors and discourse markers: contrast (however, although), cause (because, since, due to), consequence (therefore, as a result), and addition (in addition, furthermore). Reading comprehension strategies: skimming and scanning, and recognition of text structure.",
            "EFL.4.4.d.17. Simple passive voice: simple present and simple past in the passive, used in informational and science-outreach texts. Learning-to-learn strategies: use of digital resources and dictionaries to expand lexis, self-assessment, and reflection on the learning process.",
          ],
          procedimentales: [
            "EFL.4.2.p.13. Uses listening circles to share concerns, experiences, and possible solutions with peers, taking turns speaking.",
            "EFL.4.4.p.48. Reflects collectively on the learning processes at the close of a unit, sharing what was learned and what students still wish to explore.",
            "EFL.4.3.p.16. Reads general-interest magazine articles, identifying the topic, the author’s perspectives, and the examples that support the ideas.",
            "EFL.4.3.p.22. Summarizes informational or literary texts in English in a short paragraph, capturing the essential ideas and using one’s own words.",
            "EFL.4.3.p.18. Predicts the content of informational texts based on the title, images, and subtitles, and identify the main idea and supporting ideas.",
            "EFL.4.4.p.35. Produces short texts that combine information from two or three sources, organize the data, and cite the sources in a basic way.",
            "EFL.4.1.p.37. Summarizes in English texts or conversations, conveying the main ideas to a new audience.",
            "EFL.4.4.p.39. Uses bilingual and monolingual online dictionaries to expand vocabulary, verify the use of new words in context, and record them for later use.",
          ],
          actitudinales: [
            "EFL.4.3.a.9. Is willing to compare and question information from different sources, recognizing that not everything written or published is equally reliable.",
            "EFL.4.3.a.7. Shows interest in exploring a variety of English text genres, including articles, biographies, narratives, infographics, and literary texts.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.28. Active citizenship and collective responsibility: participation in community decisions, school campaigns, and actions for the common good.",
            "EFL.4.3.d.7. Written informational and outreach genres: magazine articles, informational texts, bulletins, and community announcements.",
            "EFL.4.3.d.33. Reading comprehension strategies: skimming and scanning, recognition of text structure, and basic inference.",
            "EFL.4.4.d.35. Learning-to-learn strategies: use of digital resources and dictionaries to expand lexis, self-assessment, and reflection on the learning process.",
          ],
          procedimentales: [
            "EFL.4.2.p.13. Uses listening circles to share concerns, experiences, and possible solutions with peers, taking turns speaking.",
            "EFL.4.4.p.48. Reflects collectively on the learning processes at the close of a unit, sharing what was learned and what students still wish to explore.",
            "EFL.4.3.p.16. Reads general-interest magazine articles, identifying the topic, the author’s perspectives, and the examples that support the ideas.",
            "EFL.4.3.p.22. Summarizes informational or literary texts in English in a short paragraph, capturing the essential ideas and using one’s own words.",
            "EFL.4.3.p.18. Predicts the content of informational texts based on the title, images, and subtitles, and identify the main idea and supporting ideas.",
            "EFL.4.4.p.35. Produces short texts that combine information from two or three sources, organize the data, and cite the sources in a basic way.",
            "EFL.4.1.p.37. Summarizes in English texts or conversations, conveying the main ideas to a new audience.",
            "EFL.4.4.p.39. Uses bilingual and monolingual online dictionaries to expand vocabulary, verify the use of new words in context, and record them for later use.",
          ],
          actitudinales: [
            "EFL.4.3.a.9. Is willing to compare and question information from different sources, recognizing that not everything written or published is equally reliable.",
            "EFL.4.3.a.7. Shows interest in exploring a variety of English text genres, including articles, biographies, narratives, infographics, and literary texts.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.12",
    descripcion: "Comprehending infographics about machines, tools, and everyday devices by interpreting images, labels, data, and sequences to explain how objects function, recognizing technological knowledge as part of daily life",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.36. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; and the environment.",
            "EFL.4.4.d.17. Simple passive voice: simple present in the passive, used in informational and science-outreach texts.",
            "EFL.4.3.d.9. Infographics and multimodal texts: interpretation of images, labels, and step sequences.",
          ],
          procedimentales: [
            "EFL.4.2.p.6. Describes people, objects, and places with concrete details.",
            "EFL.4.1.p.4. Follows sequences of oral instructions and short videos to complete tasks, taking notes using keywords.",
            "EFL.4.1.p.38. Relies on images and gestures to sustain comprehension and production in English when vocabulary is insufficient.",
            "EFL.4.3.p.18. Predicts the content of informational texts based on the title and images, and identify the main idea.",
            "EFL.4.3.p.19. Interprets infographics: images, labels, and step sequences.",
            "EFL.4.4.p.28. Drafts numbered, sequenced instructions for using classroom materials, with time connectors and imperatives.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks and acknowledges each person's contributions.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.36. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; the environment; and work.",
            "EFL.4.4.d.17. Simple passive voice: simple present and simple past in the passive, used in informational and science-outreach texts. Infographics and multimodal texts: interpretation of images, labels, simple statistics, and step sequences.",
          ],
          procedimentales: [
            "EFL.4.2.p.6. Describes people, objects, places, and community processes with concrete details and comparisons.",
            "EFL.4.1.p.4. Follows sequences of oral instructions and short videos to complete tasks, taking notes using keywords and checking comprehension.",
            "EFL.4.1.p.38. Relies on images, diagrams, and gestures to sustain comprehension and production in English when vocabulary is insufficient.",
            "EFL.4.3.p.18. Predicts the content of informational texts based on the title, images, and subtitles, and identify the main idea and supporting ideas.",
            "EFL.4.3.p.19. Interprets infographics: images, labels, numerical data, step sequences, and relationships among parts of an object or process.",
            "EFL.4.4.p.28. Drafts numbered, sequenced instructions for using academic and classroom materials, with time connectors and imperatives.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks, maintains participation, and acknowledges each person's contributions.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.36. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; the environment; work; and rights.",
            "EFL.4.3.d.9. Infographics and multimodal texts: interpretation of images, labels, simple statistics, and step sequences.",
          ],
          procedimentales: [
            "EFL.4.2.p.6. Describes people, objects, places, and community processes with concrete details and comparisons.",
            "EFL.4.1.p.4. Follows sequences of oral instructions and short videos to complete tasks, taking notes using keywords and checking comprehension.",
            "EFL.4.1.p.38. Relies on images, diagrams, gestures, and visual supports to sustain comprehension and production in English when vocabulary is insufficient.",
            "EFL.4.3.p.18. Predicts the content of informational texts based on the title, images, and subtitles, and identify the main idea and supporting ideas.",
            "EFL.4.3.p.19. Interprets infographics: images, labels, numerical data, step sequences, and relationships among parts of an object or process.",
            "EFL.4.4.p.28. Drafts numbered, sequenced instructions for using academic and classroom materials, with time connectors and imperatives.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks, maintains participation, and acknowledges each person's contributions.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.13",
    descripcion: "Expanding cultural knowledge by reading classical narratives in English from diverse traditions, identifying characters, conflicts, settings, and resolutions, and exploring stories that circulate across languages and cultures",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.26. Diversity of cultural traditions and ways of life in communities across Asia, Africa, and the Americas: celebrations and foods.",
            "EFL.4.3.d.33. Reading comprehension strategies: skimming and scanning.",
            "EFL.4.4.d.14. Present perfect simple: used to connect the past and present, with time markers (already, yet, just, ever, never).",
            "EFL.4.3.d.29. Local narrative and historical heritage: collective memories and events that shape a place's identity.",
          ],
          procedimentales: [
            "EFL.4.3.p.42. Contrasts English with languages known to identify similarities and differences that facilitate comprehension.",
            "EFL.4.2.p.45. Compares and describe natural environments and communities from different contexts of the world using connected descriptions.",
            "EFL.4.2.p.14. Compares two texts or sources on the same topic orally, pointing out similarities and differences.",
            "EFL.4.3.p.20. Reads classical narratives in English by identifying characters, conflict, setting, and resolution.",
            "EFL.4.3.p.40. Identifies grammatical patterns in texts that have been read and use them as models for the students’ own production.",
          ],
          actitudinales: [
            "EFL.4.3.a.7. Shows interest in exploring a variety of English text genres, including articles, biographies, and narratives.",
            "EFL.4.3.a.21. Appreciates classical narratives as expressions of people's creativity and memory.",
            "EFL.4.3.a.23. Values the artistic and cultural production of different communities with aesthetic openness and respect for the diversity of forms.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.26. Diversity of cultural traditions and ways of life in communities across Asia, Africa, the Pacific, and the Americas: celebrations, foods, and forms of organization.",
            "EFL.4.3.d.33. Reading comprehension strategies: skimming and scanning, and recognition of text structure.",
            "EFL.4.4.d.14. Present perfect simple: used to connect the past and present, with time markers (already, yet, just, ever, never), and to contrast with the simple past. Local narrative and historical heritage: collective memories, events that shape a place's identity, and diversity of voices and perspectives.",
          ],
          procedimentales: [
            "EFL.4.3.p.42. Contrasts English with languages known to identify similarities and differences that facilitate comprehension and production.",
            "EFL.4.2.p.45. Compares and describe natural environments, communities, and ways of life from different contexts of the world using connected descriptions.",
            "EFL.4.2.p.14. Compares two texts, sources, or perspectives on the same topic orally, citing evidence to point out similarities and differences.",
            "EFL.4.3.p.20. Reads classical narratives in English by identifying characters, conflict, setting, and resolution, and compare them with the students’ own narrative traditions.",
            "EFL.4.3.p.40. Identifies grammatical patterns in texts that have been read and use them as models for the students’ own oral and written production.",
          ],
          actitudinales: [
            "EFL.4.3.a.7. Shows interest in exploring a variety of English text genres, including articles, biographies, narratives, infographics, and literary texts.",
            "EFL.4.3.a.21. Appreciates classical narratives and the literary traditions of the world as expressions of people's creativity and memory.",
            "EFL.4.3.a.23. Values the artistic and cultural production of different communities of the world with aesthetic openness and respect for the diversity of forms.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.26. Diversity of cultural traditions and ways of life in communities across Asia, Africa, the Pacific, and the Americas: celebrations, foods, and forms of organization.",
            "EFL.4.3.d.33. Reading comprehension strategies: skimming and scanning, recognition of text structure, and basic inference.",
            "EFL.4.3.d.29. Local narrative and historical heritage: collective memories, events that shape a place's identity, and the diversity of voices and perspectives.",
          ],
          procedimentales: [
            "EFL.4.3.p.42. Contrasts English with languages known to identify similarities and differences that facilitate comprehension and production.",
            "EFL.4.2.p.45. Compares and describe natural environments, communities, and ways of life from different contexts of the world using connected descriptions.",
            "EFL.4.2.p.14. Compares two texts, sources, or perspectives on the same topic orally, citing evidence to point out similarities and differences.",
            "EFL.4.3.p.20. Reads classical narratives in English by identifying characters, conflict, setting, and resolution, and compare them with the students’ own narrative traditions.",
            "EFL.4.3.p.40. Identifies grammatical patterns in texts that have been read and use them as models for the students’ own oral and written production.",
          ],
          actitudinales: [
            "EFL.4.3.a.7. Shows interest in exploring a variety of English text genres, including articles, biographies, narratives, infographics, and literary texts.",
            "EFL.4.3.a.21. Appreciates classical narratives and the literary traditions of the world as expressions of people's creativity and memory.",
            "EFL.4.3.a.23. Values the artistic and cultural production of different communities of the world with aesthetic openness and respect for the diversity of forms.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.14",
    descripcion: "Collaborative reading of adapted theatre scenes in English through role-reading, interpreting stage directions, and discussing dramatic situations to understand how language, voice, and gesture create meaning in performance",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.23. Pronunciation of phonemes that pose difficulty: minimal pairs and long and short vowels.",
          ],
          procedimentales: [
            "EFL.4.2.p.46. Cooperates with classmates on shared tasks by responsibly distributing roles and resources.",
            "EFL.4.3.p.21. Reads adapted scenes from theater plays in English and interpret stage directions.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks and acknowledges each person's contributions.",
            "EFL.4.2.a.13. Commits to the classroom's collective agreements and supports peers during shared work.",
            "EFL.4.1.a.5. Values the varieties of English and the languages of the place as equally valid resources for communication and learning in the classroom.",
            "EFL.4.2.a.12. Offers and requests help with confidence, recognizing the importance of collaboration in learning.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.23. Pronunciation of phonemes that pose difficulty: minimal pairs, long and short vowels, and the consonants /θ/, /ð/, /v/.",
          ],
          procedimentales: [
            "EFL.4.2.p.46. Cooperates with classmates on shared tasks and projects by responsibly distributing roles, resources, and time.",
            "EFL.4.3.p.21. Reads adapted scenes from theater plays in English, interpret stage directions, and discuss dramatic situations in small groups.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks, maintains participation, and acknowledges each person's contributions.",
            "EFL.4.2.a.13. Commits to the classroom's collective agreements and supports peers when they face difficulties during shared work.",
            "EFL.4.1.a.5. Values the varieties of English and the languages of the place as equally valid resources for communication and learning in the school community.",
            "EFL.4.2.a.12. Offers and requests help with confidence, recognizing that collaboration is an essential part of learning.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.23. Pronunciation of phonemes that pose difficulty: minimal pairs, long and short vowels, the consonants /θ/, /ð/, /v/, and frequent diphthongs.",
          ],
          procedimentales: [
            "EFL.4.2.p.46. Cooperates with classmates on shared tasks and projects by responsibly distributing roles, resources, and time.",
            "EFL.4.3.p.21. Reads adapted scenes from theater plays in English, interpret stage directions, and discuss dramatic situations in small groups.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks, maintains participation, and acknowledges each person's contributions.",
            "EFL.4.2.a.13. Commits to the classroom's collective agreements and supports peers when they face difficulties during shared work.",
            "EFL.4.1.a.5. Values the varieties of English and the languages of the place as equally valid resources for communication and learning.",
            "EFL.4.2.a.12. Offers and requests help with confidence, recognizing that collaboration is an essential part of learning.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.15",
    descripcion: "Expanding cultural and literary knowledge by reading English-language texts as models for original story writing and by identifying literary resources and structures to support creative rewriting and personal authorship",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.33. Reading comprehension strategies: skimming and scanning.",
            "EFL.4.3.d.25. Classical narratives in English from different world traditions: genre features and archetypal characters.",
          ],
          procedimentales: [
            "EFL.4.3.p.22. Summarizes short informational texts in English in a short paragraph, capturing the essential ideas.",
            "EFL.4.3.p.20. Reads classical narratives in English by identifying characters, conflict, setting, and resolution.",
            "EFL.4.3.p.40. Identifies grammatical patterns in texts that have been read and use them as models for the students’ own production.",
            "EFL.4.4.p.34. Rewrites literary texts that have been read, preserving the essential elements.",
          ],
          actitudinales: [
            "EFL.4.3.a.21. Appreciates classical narratives as expressions of people's creativity and memory.",
            "EFL.4.3.a.8. Enjoys reading as a practice that expands knowledge and imagination, reading beyond what is strictly required.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.33. Reading comprehension strategies: skimming and scanning, and recognition of text structure.",
            "EFL.4.3.d.25. Classical narratives in English from different world traditions: genre features, archetypal characters, and conflicts.",
          ],
          procedimentales: [
            "EFL.4.3.p.22. Summarizes informational or literary texts in English in a short paragraph, capturing the essential ideas and using one’s own words.",
            "EFL.4.3.p.20. Reads classical narratives in English by identifying characters, conflict, setting, and resolution, and compare them with the students’ own narrative traditions.",
            "EFL.4.3.p.40. Identifies grammatical patterns in texts that have been read and use them as models for the students’ own oral and written production.",
            "EFL.4.4.p.34. Rewrites and transforms literary texts that have been read, preserving the essential elements and incorporating identified literary resources.",
          ],
          actitudinales: [
            "EFL.4.3.a.21. Appreciates classical narratives and the literary traditions of the world as expressions of people's creativity and memory.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.33. Reading comprehension strategies: skimming and scanning, recognition of text structure, and basic inference.",
            "EFL.4.3.d.25. Classical narratives in English from different world traditions: genre features, archetypal characters, conflicts, and resolutions.",
          ],
          procedimentales: [
            "EFL.4.3.p.22. Summarizes informational or literary texts in English in a short paragraph, capturing the essential ideas and using one’s own words.",
            "EFL.4.3.p.20. Reads classical narratives in English by identifying characters, conflict, setting, and resolution, and compare them with the students’ own narrative traditions.",
            "EFL.4.3.p.40. Identifies grammatical patterns in texts that have been read and use them as models for the students’ own oral and written production.",
            "EFL.4.4.p.34. Rewrites and transforms literary texts that have been read, preserving the essential elements and incorporating identified literary resources.",
          ],
          actitudinales: [
            "EFL.4.3.a.21. Appreciates classical narratives and the literary traditions of the world as expressions of people's creativity and memory.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.16",
    descripcion: "Participation in English-language verbal games through exchanges of clues, riddles, and wordplay to explore sound, meaning, and figurative language, recognizing language as a source of creativity and enjoyment",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.1.d.20. Word stress in vocabulary: stressed syllables in two-syllable nouns and verbs.",
            "EFL.4.1.d.22. Rhythm and timing in English: English as a stress-timed language and rhythmic patterns in statements.",
            "EFL.4.3.d.25. Classical narratives in English from different world traditions: genre features and archetypal characters.",
          ],
          procedimentales: [
            "EFL.4.3.p.42. Contrasts English with languages known to identify similarities and differences that facilitate comprehension.",
            "EFL.4.2.p.9. Improvises short oral interactions based on images and role plays, exploring English creatively.",
            "EFL.4.3.p.20. Reads classical narratives in English by identifying characters, conflict, setting, and resolution.",
            "EFL.4.3.p.21. Reads adapted scenes from theater plays in English and interpret stage directions.",
            "EFL.4.4.p.34. Rewrites literary texts that have been read, preserving the essential elements.",
          ],
          actitudinales: [
            "EFL.4.1.a.5. Values the varieties of English and the languages of the place as equally valid resources for communication and learning in the classroom.",
            "EFL.4.3.a.21. Appreciates classical narratives as expressions of people's creativity and memory.",
            "EFL.4.3.a.8. Enjoys reading as a practice that expands knowledge and imagination, reading beyond what is strictly required.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.1.d.20. Word stress in vocabulary: stressed syllables in two-syllable nouns and verbs, and stress shift driven by grammatical function.",
            "EFL.4.1.d.22. Rhythm and timing in English: English as a stress-timed language, and rhythmic patterns in statements and questions.",
            "EFL.4.3.d.25. Classical narratives in English from different world traditions: genre features, archetypal characters, and conflicts.",
          ],
          procedimentales: [
            "EFL.4.3.p.42. Contrasts English with languages known to identify similarities and differences that facilitate comprehension and production.",
            "EFL.4.2.p.9. Improvises short oral interactions based on images, unexpected situations, and role plays, exploring English creatively.",
            "EFL.4.3.p.20. Reads classical narratives in English by identifying characters, conflict, setting, and resolution, and compare them with the students’ own narrative traditions.",
            "EFL.4.3.p.21. Reads adapted scenes from theater plays in English, interpret stage directions, and discuss dramatic situations in small groups.",
            "EFL.4.4.p.34. Rewrites and transforms literary texts that have been read, preserving the essential elements and incorporating identified literary resources.",
          ],
          actitudinales: [
            "EFL.4.1.a.5. Values the varieties of English and the languages of the place as equally valid resources for communication and learning in the school community.",
            "EFL.4.2.a.22. Enjoys creative improvisation and play with language as ways of exploring English with confidence. Appreciates classical narratives and the literary traditions of the world as expressions of people's creativity and memory.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.1.d.20. Word stress in vocabulary: stressed syllables in two-syllable nouns and verbs, and stress shift driven by grammatical function.",
            "EFL.4.1.d.22. Rhythm and timing in English: English as a stress-timed language, and rhythmic patterns in statements and questions.",
            "EFL.4.3.d.25. Classical narratives in English from different world traditions: genre features, archetypal characters, conflicts, and resolutions.",
          ],
          procedimentales: [
            "EFL.4.3.p.42. Contrasts English with languages known to identify similarities and differences that facilitate comprehension and production.",
            "EFL.4.2.p.9. Improvises short oral interactions based on images, unexpected situations, and role plays, exploring English creatively.",
            "EFL.4.3.p.20. Reads classical narratives in English by identifying characters, conflict, setting, and resolution, and compare them with the students’ own narrative traditions.",
            "EFL.4.3.p.21. Reads adapted scenes from theater plays in English, interpret stage directions, and discuss dramatic situations in small groups.",
            "EFL.4.4.p.34. Rewrites and transforms literary texts that have been read, preserving the essential elements and incorporating identified literary resources.",
          ],
          actitudinales: [
            "EFL.4.1.a.5. Values the varieties of English and the languages of the place as equally valid resources for communication and learning.",
            "EFL.4.3.a.21. Appreciates classical narratives and the literary traditions of the world as expressions of people's creativity and memory.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.17",
    descripcion: "Collective action to create prevention texts on natural and human risks through scripts, posters, or informational messages to promote safety and well-being among peers and families, recognizing shared responsibility for risk prevention",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.15. Ways of talking about the future in English: will for predictions and spontaneous decisions, and be going to for plans.",
            "EFL.4.4.d.17. Simple passive voice: simple present in the passive, used in informational and science-outreach texts.",
            "EFL.4.4.d.11. Instructional and prevention texts: use of the imperative and numbered steps.",
            "EFL.4.4.d.34. Planning for written production: defining purpose and audience, and organizing ideas in an outline.",
          ],
          procedimentales: [
            "EFL.4.2.p.43. Describes practices of care for the body and health in short presentations, using appropriate vocabulary.",
            "EFL.4.3.p.18. Predicts the content of informational texts based on the title and images, and identify the main idea.",
            "EFL.4.4.p.23. The text's content, order, and audience. Drafts outlines and idea maps before writing to plan the text's content and order.",
            "EFL.4.4.p.24. Writes short prevention texts (posters, informational messages) about natural and human risks, using the imperative.",
            "EFL.4.4.p.29. Prepares scripts and visual aids for presentations on digital risks, structuring the information.",
            "EFL.4.4.p.33. Revises and corrects one’s own drafts using criteria of cohesion, coherence, and spelling.",
            "EFL.4.2.p.47. Plans a project or presentation with peers by defining its purpose, audience, and materials.",
          ],
          actitudinales: [
            "EFL.4.4.a.14. Takes responsibility for their learning tasks: plans them and meets deadlines.",
            "EFL.4.4.a.18. Recognizes and values individual practices for preventing natural and human risks as a shared responsibility.",
            "EFL.4.3.a.20. Values the natural environment and the community’s practices of care as part of the common heritage.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.15. Ways of talking about the future in English: will (predictions and spontaneous decisions), be going to (plans), and the present continuous with a future meaning.",
            "EFL.4.4.d.17. Simple passive voice: simple present and simple past in the passive, used in informational and science-outreach texts. Instructional and prevention texts: use of the imperative, numbered steps, and time-sequence connectors.",
            "EFL.4.4.d.34. Planning for written production: defining purpose and audience, organizing ideas in an outline, and drafting.",
          ],
          procedimentales: [
            "EFL.4.2.p.43. Describes practices of care for the body, health, and emotional well-being in short presentations, using appropriate vocabulary.",
            "EFL.4.3.p.18. Predicts the content of informational texts based on the title, images, and subtitles, and identify the main idea and supporting ideas.",
            "EFL.4.4.p.23. Drafts outlines and idea maps before writing to plan the text's content, order, and audience.",
            "EFL.4.4.p.24. Writes short prevention texts (posters, scripts, informational messages) about natural and human risks, using the imperative and the first conditional.",
            "EFL.4.4.p.29. Prepares scripts and visual aids for presentations on digital risks, structuring the information and anticipating audience questions.",
            "EFL.4.4.p.33. Revises and corrects one’s own drafts and those of peers using criteria of cohesion, coherence, lexical precision, and spelling.",
            "EFL.4.2.p.47. Plans a campaign, project, or presentation with peers by defining its purpose, audience, stages, and materials.",
          ],
          actitudinales: [
            "EFL.4.4.a.14. Takes responsibility for their learning tasks: plans them, meets deadlines, and communicates obstacles in advance.",
            "EFL.4.4.a.18. Recognizes and values individual and collective practices for preventing natural and human risks as a shared responsibility.",
            "EFL.4.3.a.20. Values the natural environment and the community’s practices of care as part of the common heritage that is inherited and passed on.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.11. Instructional and prevention texts: use of the imperative, time-sequence connectors, numbered steps, and cautionary register.",
            "EFL.4.4.d.34. Planning for written production: defining purpose and audience, organizing ideas in an outline, drafting, and revising.",
          ],
          procedimentales: [
            "EFL.4.2.p.43. Describes practices of care for the body, health, and emotional well-being in short presentations, using appropriate vocabulary.",
            "EFL.4.3.p.18. Predicts the content of informational texts based on the title, images, and subtitles, and identify the main idea and supporting ideas.",
            "EFL.4.4.p.23. Drafts outlines and idea maps before writing to plan the text's content, order, and audience.",
            "EFL.4.4.p.24. Writes short prevention texts (posters, scripts, informational messages) about natural and human risks, using the imperative and the first conditional.",
            "EFL.4.4.p.29. Prepares scripts and visual aids for presentations on digital risks, structuring the information and anticipating audience questions.",
            "EFL.4.4.p.33. Revises and corrects one’s own drafts and those of peers using criteria of cohesion, coherence, lexical precision, and spelling.",
            "EFL.4.2.p.47. Plans a campaign, project, or presentation with peers by defining its purpose, audience, stages, and materials.",
          ],
          actitudinales: [
            "EFL.4.4.a.14. Takes responsibility for their learning tasks: plans them, meets deadlines, and communicates obstacles in advance.",
            "EFL.4.4.a.18. Recognizes and values individual and collective practices for preventing natural and human risks as a shared responsibility.",
            "EFL.4.3.a.20. Values the natural environment and the community’s practices of care as part of the common heritage that is inherited and passed on.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.18",
    descripcion: "Dissemination of cultural activities in the school and community through bulletins, announcements, or promotional texts to inform and invite participation, recognizing the importance of cultural life in community development",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.7. Written informational and outreach genres: informational texts and bulletins.",
            "EFL.4.4.d.34. Planning for written production: defining purpose and audience, and organizing ideas in an outline.",
          ],
          procedimentales: [
            "EFL.4.2.p.6. Describes people, objects, and places with concrete details.",
            "EFL.4.1.p.37. Conveying the main ideas to a new audience. Summarizes in English short texts or conversations, conveying the main ideas to a familiar audience.",
            "EFL.4.4.p.23. The text's content, order, and audience. Drafts outlines and idea maps before writing to plan the text's content and order.",
            "EFL.4.4.p.33. Revises and corrects one’s own drafts using criteria of cohesion, coherence, and spelling.",
            "EFL.4.4.p.25. Writes bulletins and announcements to communicate school activities in an organized manner.",
            "EFL.4.4.p.31. Develops informational materials for school campaigns on the rights of young people, such as posters or clear, well-organized messages.",
          ],
          actitudinales: [
            "EFL.4.3.a.23. Values the artistic and cultural production of different communities with aesthetic openness and respect for the diversity of forms.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.7. Written informational and outreach genres: magazine articles, informational texts, and bulletins.",
            "EFL.4.4.d.34. Planning for written production: defining purpose and audience, organizing ideas in an outline, and drafting.",
          ],
          procedimentales: [
            "EFL.4.2.p.6. Describes people, objects, places, and community processes with concrete details and comparisons.",
            "EFL.4.1.p.37. Summarizes in English texts or conversations, conveying the main ideas to a new audience.",
            "EFL.4.4.p.23. Drafts outlines and idea maps before writing to plan the text's content, order, and audience.",
            "EFL.4.4.p.33. Revises and corrects one’s own drafts and those of peers using criteria of cohesion, coherence, lexical precision, and spelling.",
            "EFL.4.4.p.25. Writes bulletins, announcements, and short promotional texts to communicate cultural and school activities in an organized manner.",
            "EFL.4.4.p.31. Develops informational materials for school campaigns on the rights of young people, such as posters, brochures, or clear, well-organized messages.",
          ],
          actitudinales: [
            "EFL.4.3.a.23. Values the artistic and cultural production of different communities of the world with aesthetic openness and respect for the diversity of forms.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.7. Written informational and outreach genres: magazine articles, informational texts, bulletins, and community announcements.",
            "EFL.4.4.d.34. Planning for written production: defining purpose and audience, organizing ideas in an outline, drafting, and revising.",
          ],
          procedimentales: [
            "EFL.4.2.p.6. Describes people, objects, places, and community processes with concrete details and comparisons.",
            "EFL.4.1.p.37. Summarizes in English texts or conversations, conveying the main ideas to a new audience.",
            "EFL.4.4.p.23. Drafts outlines and idea maps before writing to plan the text's content, order, and audience.",
            "EFL.4.4.p.33. Revises and corrects one’s own drafts and those of peers using criteria of cohesion, coherence, lexical precision, and spelling.",
            "EFL.4.4.p.25. Writes bulletins, announcements, and short promotional texts to communicate cultural and school activities in an organized manner.",
            "EFL.4.4.p.31. Develops informational materials for school campaigns on the rights of young people, such as posters, brochures, or clear, well-organized messages.",
          ],
          actitudinales: [
            "EFL.4.3.a.23. Values the artistic and cultural production of different communities of the world with aesthetic openness and respect for the diversity of forms.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.19",
    descripcion: "Recommendation of academic information through brief website reviews, using explicit criteria to guide peers in identifying reliable sources and evaluating the quality and credibility of online information",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.30. Media and informational perspectives: how different outlets present the same event, and the notion of source.",
            "EFL.4.4.d.35. Learning-to-learn strategies: use of dictionaries to expand lexis and self-assessment.",
            "EFL.4.3.d.10. Short reviews and assessments: description, opinion, and evaluative vocabulary.",
          ],
          procedimentales: [
            "EFL.4.2.p.15. Expresses agreement and disagreement respectfully in classroom debates and discussions.",
            "EFL.4.4.p.35. Produces short texts that combine information from two sources, organize the data, and cite the sources in a basic way.",
            "EFL.4.4.p.39. Uses bilingual online dictionaries to expand vocabulary and verify the use of new words in context.",
            "EFL.4.4.p.26. Writes short reviews of websites and academic materials using criteria of authorship, date, and purpose.",
            "EFL.4.4.p.41. Sets short language-learning goals and records progress.",
          ],
          actitudinales: [
            "EFL.4.3.a.9. Is willing to compare information from different sources, recognizing that not everything written or published is equally reliable.",
            "EFL.4.4.a.17. Commits to ethical practices in the use of digital information: cites sources and acknowledges the authorship of the materials they use.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.30. Media and informational perspectives: how different outlets present the same event, and the notions of source, bias, and credibility.",
            "EFL.4.4.d.35. Learning-to-learn strategies: use of digital resources and dictionaries to expand lexis, self-assessment, and reflection on the learning process.",
            "EFL.4.3.d.10. Short reviews and assessments: description, opinion, recommendation, evaluative vocabulary, and explicit criteria.",
          ],
          procedimentales: [
            "EFL.4.2.p.15. Expresses agreement and disagreement respectfully and propose alternatives in classroom and community debates and discussions.",
            "EFL.4.4.p.35. Produces short texts that combine information from two or three sources, organize the data, and cite the sources in a basic way.",
            "EFL.4.4.p.39. Uses bilingual and monolingual online dictionaries to expand vocabulary, verify the use of new words in context, and record them for later use.",
            "EFL.4.4.p.26. Writes short reviews of websites and academic materials using explicit criteria (authorship, date, purpose, reliability).",
            "EFL.4.4.p.41. Sets short language-learning goals, records progress, and reflects on the strategies that were used.",
          ],
          actitudinales: [
            "EFL.4.3.a.9. Is willing to compare and question information from different sources, recognizing that not everything written or published is equally reliable.",
            "EFL.4.4.a.17. Commits to ethical practices in the use of digital information: cites sources, asks for permission, and acknowledges the authorship of the materials they use.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.30. Media and informational perspectives: how different outlets present the same event, and the notions of source, bias, and credibility.",
            "EFL.4.4.d.35. Learning-to-learn strategies: use of digital resources and dictionaries to expand lexis, self-assessment, and reflection on the learning process.",
            "EFL.4.3.d.10. Short reviews and assessments: structure (description + opinion + recommendation), evaluative vocabulary, and explicit criteria.",
          ],
          procedimentales: [
            "EFL.4.2.p.15. Expresses agreement and disagreement respectfully and propose alternatives in classroom and community debates and discussions.",
            "EFL.4.4.p.35. Produces short texts that combine information from two or three sources, organize the data, and cite the sources in a basic way.",
            "EFL.4.4.p.39. Uses bilingual and monolingual online dictionaries to expand vocabulary, verify the use of new words in context, and record them for later use.",
            "EFL.4.4.p.26. Writes short reviews of websites and academic materials using explicit criteria (authorship, date, purpose, reliability).",
            "EFL.4.4.p.41. Sets short language-learning goals, records progress, and reflects on the strategies that were used.",
          ],
          actitudinales: [
            "EFL.4.3.a.9. Is willing to compare and question information from different sources, recognizing that not everything written or published is equally reliable.",
            "EFL.4.4.a.17. Commits to ethical practices in the use of digital information: cites sources, asks for permission, and acknowledges the authorship of the materials they use.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.20",
    descripcion: "Response to cultural expressions in television, series, and online content through summaries and personal opinions in English and community languages to participate in discussions and reflect critically on media messages",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.31. Linguistic mediation: strategies for reformulating and simplifying information across languages or for different audiences.",
            "EFL.4.3.d.30. Media and informational perspectives: how different outlets present the same event, and the notion of source.",
            "EFL.4.4.d.18. Connectors and discourse markers: contrast (however, although), cause (because, since), and addition (in addition).",
            "EFL.4.3.d.10. Short reviews and assessments: description, opinion, and evaluative vocabulary.",
          ],
          procedimentales: [
            "EFL.4.2.p.8. Expresses opinions and justify them briefly with relevant reasons in classroom conversations and discussions.",
            "EFL.4.4.p.36. Paraphrases information read or heard in English from another language of the classroom or the community.",
            "EFL.4.4.p.36. Paraphrases information read or heard in English from another language of the classroom or the community.",
            "EFL.4.1.p.2. Distinguishes perspectives and voices in short audiovisual reports on the same event, recognizing differences in how the information is presented.",
            "EFL.4.4.p.32. Writes short opinion paragraphs in English with a claim and reasons.",
            "EFL.4.3.p.16. Reads general-interest magazine articles, identifying the topic and the author’s perspectives.",
            "EFL.4.4.p.27. Writes summaries and personal opinions about television content and series, expressing points of view.",
            "EFL.4.4.p.26. Writes short reviews of websites and academic materials using criteria of authorship, date, and purpose.",
          ],
          actitudinales: [
            "EFL.4.3.a.11. Acts as a mediator between languages and people, facilitating mutual understanding in the classroom.",
            "EFL.4.2.a.6. Is willing to consider viewpoints different from their own.",
            "EFL.4.3.a.23. Values the artistic and cultural production of different communities with aesthetic openness and respect for the diversity of forms.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.31. Linguistic mediation: strategies for reformulating, paraphrasing, and simplifying information across languages or for different audiences.",
            "EFL.4.3.d.30. Media and informational perspectives: how different outlets present the same event, and the notions of source, bias, and credibility.",
            "EFL.4.4.d.18. Connectors and discourse markers: contrast (however, although), cause (because, since, due to), consequence (therefore, as a result), and addition (in addition, furthermore). Short reviews and assessments: description, opinion, recommendation, evaluative vocabulary, and explicit criteria.",
          ],
          procedimentales: [
            "EFL.4.2.p.8. Expresses opinions and justify them briefly with relevant reasons and examples in classroom conversations and discussions.",
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.1.p.2. Distinguishes perspectives, voices, and approaches in short audiovisual reports on the same event, recognizing differences in how the information is presented.",
            "EFL.4.4.p.32. Writes short opinion paragraphs in English with a claim, reasons, and a supporting example or piece of evidence.",
            "EFL.4.3.p.16. Reads general-interest magazine articles, identifying the topic, the author’s perspectives, and the examples that support the ideas.",
            "EFL.4.4.p.27. Writes summaries and personal opinions about television content, series, and online materials, expressing informed points of view.",
            "EFL.4.4.p.26. Writes short reviews of websites and academic materials using explicit criteria (authorship, date, purpose, reliability).",
          ],
          actitudinales: [
            "EFL.4.3.a.11. Acts as a mediator between languages, people, or perspectives, facilitating mutual understanding in the classroom.",
            "EFL.4.2.a.6. Is willing to revise their own perspectives when encountering viewpoints different from their own.",
            "EFL.4.3.a.23. Values the artistic and cultural production of different communities of the world with aesthetic openness and respect for the diversity of forms.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.31. Linguistic mediation: strategies for reformulating, paraphrasing, and simplifying information across languages or for different audiences.",
            "EFL.4.3.d.30. Media and informational perspectives: how different outlets present the same event, and the notions of source, bias, and credibility.",
            "EFL.4.3.d.10. Short reviews and assessments: structure (description + opinion + recommendation), evaluative vocabulary, and explicit criteria.",
          ],
          procedimentales: [
            "EFL.4.2.p.8. Expresses opinions and justify them briefly with relevant reasons and examples in classroom conversations and discussions.",
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.4.p.36. Paraphrases and reformulates, orally or in writing, information read or heard in English from another language of the classroom or the community.",
            "EFL.4.1.p.2. Distinguishes perspectives, voices, and approaches in short audiovisual reports on the same event, recognizing differences in how the information is presented.",
            "EFL.4.4.p.32. Writes short opinion paragraphs in English with a claim, reasons, and a supporting example or piece of evidence.",
            "EFL.4.3.p.16. Reads general-interest magazine articles, identifying the topic, the author’s perspectives, and the examples that support the ideas.",
            "EFL.4.4.p.27. Writes summaries and personal opinions about television content, series, and online materials, expressing informed points of view.",
            "EFL.4.4.p.26. Writes short reviews of websites and academic materials using explicit criteria (authorship, date, purpose, reliability).",
          ],
          actitudinales: [
            "EFL.4.3.a.11. Acts as a mediator between languages, people, or perspectives, facilitating mutual understanding in the classroom.",
            "EFL.4.2.a.6. Is willing to revise their own perspectives when encountering viewpoints different from their own.",
            "EFL.4.3.a.23. Values the artistic and cultural production of different communities of the world with aesthetic openness and respect for the diversity of forms.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.21",
    descripcion: "Production of instructional texts for classroom and academic materials, using numbered sequences, imperatives, and temporal connectors to support peers in the effective use of shared resources, recognizing peer learning as part of everyday practice",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.9. Infographics and multimodal texts: interpretation of images, labels, and step sequences.",
            "EFL.4.4.d.11. Instructional and prevention texts: use of the imperative and numbered steps.",
          ],
          procedimentales: [
            "EFL.4.1.p.4. Follows sequences of oral instructions and short videos to complete tasks, taking notes using keywords.",
            "EFL.4.3.p.19. Interprets infographics: images, labels, and step sequences.",
            "EFL.4.4.p.28. Drafts numbered, sequenced instructions for using classroom materials, with time connectors and imperatives.",
            "EFL.4.3.p.40. Identifies grammatical patterns in texts that have been read and use them as models for the students’ own production.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks and acknowledges each person's contributions.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.9. Infographics and multimodal texts: interpretation of images, labels, simple statistics, and step sequences.",
            "EFL.4.4.d.11. Instructional and prevention texts: use of the imperative, numbered steps, and time-sequence connectors.",
          ],
          procedimentales: [
            "EFL.4.1.p.4. Follows sequences of oral instructions and short videos to complete tasks, taking notes using keywords and checking comprehension.",
            "EFL.4.3.p.19. Interprets infographics: images, labels, numerical data, step sequences, and relationships among parts of an object or process.",
            "EFL.4.4.p.28. Drafts numbered, sequenced instructions for using academic and classroom materials, with time connectors and imperatives.",
            "EFL.4.3.p.40. Identifies grammatical patterns in texts that have been read and use them as models for the students’ own oral and written production.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks, maintains participation, and acknowledges each person's contributions.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.3.d.9. Infographics and multimodal texts: interpretation of images, labels, simple statistics, and step sequences.",
            "EFL.4.4.d.11. Instructional and prevention texts: use of the imperative, time-sequence connectors, numbered steps, and cautionary register.",
          ],
          procedimentales: [
            "EFL.4.1.p.4. Follows sequences of oral instructions and short videos to complete tasks, taking notes using keywords and checking comprehension.",
            "EFL.4.3.p.19. Interprets infographics: images, labels, numerical data, step sequences, and relationships among parts of an object or process.",
            "EFL.4.4.p.28. Drafts numbered, sequenced instructions for using academic and classroom materials, with time connectors and imperatives.",
            "EFL.4.3.p.40. Identifies grammatical patterns in texts that have been read and use them as models for the students’ own oral and written production.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks, maintains participation, and acknowledges each person's contributions.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.22",
    descripcion: "Reflection on risks in digital environments through scripts, visual supports, and question-and-answer activities to explain common online risks and propose strategies for safe participation, recognizing shared responsibility for digital well-being",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.16. First conditional: structure: If + simple present + will; used to express possible consequences.",
            "EFL.4.4.d.35. Learning-to-learn strategies: use of dictionaries to expand lexis and self-assessment.",
            "EFL.4.3.d.9. Infographics and multimodal texts: interpretation of images, labels, and step sequences.",
            "EFL.4.4.d.11. Instructional and prevention texts: use of the imperative and numbered steps.",
          ],
          procedimentales: [
            "EFL.4.2.p.7. Presents information orally on an academic topic with visual support, organizing ideas clearly.",
            "EFL.4.1.p.38. Relies on images and gestures to sustain comprehension and production in English when vocabulary is insufficient.",
            "EFL.4.4.p.39. Uses bilingual online dictionaries to expand vocabulary and verify the use of new words in context.",
            "EFL.4.3.p.19. Interprets infographics: images, labels, and step sequences.",
            "EFL.4.4.p.24. Writes short prevention texts (posters, informational messages) about natural and human risks, using the imperative.",
            "EFL.4.4.p.29. Prepares scripts and visual aids for presentations on digital risks, structuring the information.",
            "EFL.4.4.p.41. Sets short language-learning goals and records progress.",
          ],
          actitudinales: [
            "EFL.4.2.a.12. Offers and requests help with confidence, recognizing the importance of collaboration in learning.",
            "EFL.4.4.a.17. Commits to ethical practices in the use of digital information: cites sources and acknowledges the authorship of the materials they use.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.35. First conditioLearning-to-learn strategies: use of digital resources and dictionaries to expand lexis, self-assessment, and reflection on the learning process.",
            "EFL.4.4.d.16. Nal: structure: If + simple present + will; used to express possible consequences and prevention situations.",
            "EFL.4.3.d.9. Infographics and multimodal texts: interpretation of images, labels, simple statistics, and step sequences.",
            "EFL.4.4.d.11. Instructional and prevention texts: use of the imperative, numbered steps, and time-sequence connectors.",
          ],
          procedimentales: [
            "EFL.4.2.p.7. Presents information orally on an academic or community topic with visual support, organizing ideas clearly.",
            "EFL.4.1.p.38. Relies on images, diagrams, and gestures to sustain comprehension and production in English when vocabulary is insufficient.",
            "EFL.4.4.p.39. Uses bilingual and monolingual online dictionaries to expand vocabulary, verify the use of new words in context, and record them for later use.",
            "EFL.4.3.p.19. Interprets infographics: images, labels, numerical data, step sequences, and relationships among parts of an object or process.",
            "EFL.4.4.p.24. Writes short prevention texts (posters, scripts, informational messages) about natural and human risks, using the imperative and the first conditional.",
            "EFL.4.4.p.29. Prepares scripts and visual aids for presentations on digital risks, structuring the information and anticipating audience questions.",
            "EFL.4.4.p.41. Sets short language-learning goals, records progress, and reflects on the strategies that were used.",
          ],
          actitudinales: [
            "EFL.4.2.a.12. Offers and requests help with confidence, recognizing that collaboration is an essential part of learning.",
            "EFL.4.4.a.17. Commits to ethical practices in the use of digital information: cites sources, asks for permission, and acknowledges the authorship of the materials they use.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.16. First conditional: structure: If + simple present + will; used to express possible consequences and prevention situations.",
            "EFL.4.4.d.35. Learning-to-learn strategies: use of digital resources and dictionaries to expand lexis, self-assessment, and reflection on the learning process.",
            "EFL.4.3.d.9. Infographics and multimodal texts: interpretation of images, labels, simple statistics, and step sequences.",
            "EFL.4.4.d.11. Instructional and prevention texts: use of the imperative, time-sequence connectors, numbered steps, and cautionary register.",
          ],
          procedimentales: [
            "EFL.4.2.p.7. Presents information orally on an academic or community topic with visual support, organizing ideas clearly.",
            "EFL.4.1.p.38. Relies on images, diagrams, gestures, and visual supports to sustain comprehension and production in English when vocabulary is insufficient.",
            "EFL.4.4.p.39. Uses bilingual and monolingual online dictionaries to expand vocabulary, verify the use of new words in context, and record them for later use.",
            "EFL.4.3.p.19. Interprets infographics: images, labels, numerical data, step sequences, and relationships among parts of an object or process.",
            "EFL.4.4.p.24. Writes short prevention texts (posters, scripts, informational messages) about natural and human risks, using the imperative and the first conditional.",
            "EFL.4.4.p.29. Prepares scripts and visual aids for presentations on digital risks, structuring the information and anticipating audience questions.",
            "EFL.4.4.p.41. Sets short language-learning goals, records progress, and reflects on the strategies that were used.",
          ],
          actitudinales: [
            "EFL.4.2.a.12. Offers and requests help with confidence, recognizing that collaboration is an essential part of learning.",
            "EFL.4.4.a.17. Commits to ethical practices in the use of digital information: cites sources, asks for permission, and acknowledges the authorship of the materials they use.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.23",
    descripcion: "Development of historical understanding through short reports on local historical topics, using guided research, structured writing, and peer review to communicate historical perspectives and recognize diverse contributions to collective memory",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.13. Past tenses in English: simple past (regular and irregular) and past continuous.",
            "EFL.4.4.d.18. Connectors and discourse markers: contrast (however, although), cause (because, since), and addition (in addition).",
            "EFL.4.3.d.8. Short biographical text: chronology, key events, and vocabulary of life stages.",
            "EFL.4.4.d.14. Present perfect simple: used to connect the past and present, with time markers (already, yet, just, ever, never).",
            "EFL.4.3.d.29. Local narrative and historical heritage: collective memories and events that shape a place's identity.",
            "EFL.4.4.d.34. Planning for written production: defining purpose and audience, and organizing ideas in an outline.",
            "EFL.4.3.d.12. Short school report: introduction, development, conclusion, and organized paragraphs.",
          ],
          procedimentales: [
            "EFL.4.2.p.10. Takes part in interviews with community members, asking questions and thanking participants.",
            "EFL.4.4.p.48. Reflects collectively on the learning processes at the close of a unit, sharing what was learned.",
            "EFL.4.4.p.32. Writes short opinion paragraphs in English with a claim and reasons.",
            "EFL.4.3.p.17. Relationships. Reads short biographical texts about diverse people and identify key events and motivations.",
            "EFL.4.4.p.30. Writes a short school report on a local history topic by consulting guided sources and organizing the information.",
            "EFL.4.4.p.35. Produces short texts that combine information from two sources, organize the data, and cite the sources in a basic way.",
            "EFL.4.4.p.23. The text's content, order, and audience. Drafts outlines and idea maps before writing to plan the text's content and order.",
            "EFL.4.4.p.33. Revises and corrects one’s own drafts using criteria of cohesion, coherence, and spelling.",
          ],
          actitudinales: [
            "EFL.4.4.a.24. Recognizes writing and narration as ways of constructing identity.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.13. Past tenses in English: simple past (regular and irregular), past continuous, and the contrast between completed actions and actions in progress.",
            "EFL.4.4.d.18. Connectors and discourse markers: contrast (however, although), cause (because, since, due to), consequence (therefore, as a result), and addition (in addition, furthermore). Short biographical text: chronology, key events, motivations, use of timelines, and vocabulary of life stages.",
            "EFL.4.4.d.14. Present perfect simple: used to connect the past and present, with time markers (already, yet, just, ever, never), and to contrast with the simple past. Local narrative and historical heritage: collective memories, events that shape a place's identity, and diversity of voices and perspectives.",
            "EFL.4.4.d.34. Planning for written production: defining purpose and audience, organizing ideas in an outline, and drafting.",
            "EFL.4.3.d.12. Short school report: introduction, development, conclusion, organized paragraphs, and basic citation conventions.",
          ],
          procedimentales: [
            "EFL.4.2.p.10. Takes part in interviews with community members, asking follow-up questions, requesting clarification, and thanking participants.",
            "EFL.4.4.p.48. Reflects collectively on the learning processes at the close of a unit, sharing what was learned and what students still wish to explore.",
            "EFL.4.4.p.32. Writes short opinion paragraphs in English with a claim, reasons, and a supporting example or piece of evidence.",
            "EFL.4.3.p.17. Reads short biographical texts about diverse people and identify key events, motivations, and cause-and-effect relationships.",
            "EFL.4.4.p.30. Writes a short school report on a local history topic by consulting guided sources, organizing the information, and revising with peers.",
            "EFL.4.4.p.35. Produces short texts that combine information from two or three sources, organize the data, and cite the sources in a basic way.",
            "EFL.4.4.p.23. Drafts outlines and idea maps before writing to plan the text's content, order, and audience.",
            "EFL.4.4.p.33. Revises and corrects one’s own drafts and those of peers using criteria of cohesion, coherence, lexical precision, and spelling.",
          ],
          actitudinales: [
            "EFL.4.4.a.24. Recognizes writing and narration as ways of constructing identity and contributing to the community's collective memory.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.13. Past tenses in English: simple past (regular and irregular), past continuous, and the contrast between completed actions and actions in progress.",
            "EFL.4.3.d.8. Short biographical text: structure (chronology, key events, motivations), use of timelines, and vocabulary of life stages.",
            "EFL.4.3.d.29. Local narrative and historical heritage: collective memories, events that shape a place's identity, and the diversity of voices and perspectives.",
            "EFL.4.4.d.34. Planning for written production: defining purpose and audience, organizing ideas in an outline, drafting, and revising.",
            "EFL.4.3.d.12. Short school report: structure (introduction, development, conclusion), organized paragraphs, and basic citation conventions.",
          ],
          procedimentales: [
            "EFL.4.2.p.10. Takes part in interviews with community members, asking follow-up questions, requesting clarification, and thanking participants.",
            "EFL.4.4.p.48. Reflects collectively on the learning processes at the close of a unit, sharing what was learned and what students still wish to explore.",
            "EFL.4.4.p.32. Writes short opinion paragraphs in English with a claim, reasons, and a supporting example or piece of evidence.",
            "EFL.4.3.p.17. Reads short biographical texts about diverse people and identify key events, motivations, and cause-and-effect relationships.",
            "EFL.4.4.p.30. Writes a short school report on a local history topic by consulting guided sources, organizing the information, and revising with peers.",
            "EFL.4.4.p.35. Produces short texts that combine information from two or three sources, organize the data, and cite the sources in a basic way.",
            "EFL.4.4.p.23. Drafts outlines and idea maps before writing to plan the text's content, order, and audience.",
            "EFL.4.4.p.33. Revises and corrects one’s own drafts and those of peers using criteria of cohesion, coherence, lexical precision, and spelling.",
          ],
          actitudinales: [
            "EFL.4.4.a.15. Accepts error as part of the learning process and revises their own production with a willingness to improve.",
            "EFL.4.4.a.24. Recognizes writing and narration as ways of constructing identity and contributing to the community's collective memory.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.4.24",
    descripcion: "Collective organization of actions to promote the rights of young people through school campaigns and informational materials that communicate the importance of these rights to peers, families, and the community, recognizing their role in participation, well-being, and inclusion",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.15. Ways of talking about the future in English: will for predictions and spontaneous decisions, and be going to for plans.",
            "EFL.4.2.d.28. Active citizenship and collective responsibility: participation in school decisions and actions for the common good.",
            "EFL.4.4.d.27. Rights of young people: rights of participation, protection, and well-being in school contexts.",
            "EFL.4.4.d.36. Work; and rights. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; and the environment.",
            "EFL.4.3.d.12. Short school report: introduction, development, conclusion, and organized paragraphs.",
          ],
          procedimentales: [
            "EFL.4.2.p.7. Presents information orally on an academic topic with visual support, organizing ideas clearly.",
            "EFL.4.2.p.8. Expresses opinions and justify them briefly with relevant reasons in classroom conversations and discussions.",
            "EFL.4.2.p.11. Takes part in discussions and dialogue tables on school topics, contributing proposals and concrete examples.",
            "EFL.4.2.p.46. Projects by responsibly distributing roles, resources, and time. Cooperates with classmates on shared tasks by responsibly distributing roles and resources.",
            "EFL.4.4.p.24. Writes short prevention texts (posters, informational messages) about natural and human risks, using the imperative.",
            "EFL.4.2.p.47. Plans a project or presentation with peers by defining its purpose, audience, and materials.",
            "EFL.4.4.p.25. Writes bulletins and announcements to communicate school activities in an organized manner.",
            "EFL.4.4.p.31. Develops informational materials for school campaigns on the rights of young people, such as posters or clear, well-organized messages.",
            "EFL.4.4.p.41. Sets short language-learning goals and records progress.",
            "EFL.4.4.p.44. Inquires about natural and human-made risks affecting the community and records the information.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks and acknowledges each person's contributions.",
            "EFL.4.2.a.13. Commits to the classroom's collective agreements and supports peers during shared work.",
            "EFL.4.4.a.14. Takes responsibility for their learning tasks: plans them and meets deadlines.",
            "EFL.4.4.a.18. Recognizes and values individual practices for preventing natural and human risks as a shared responsibility.",
            "EFL.4.3.a.20. Values the natural environment and the community’s practices of care as part of the common heritage.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.4.d.15. Ways of talking about the future in English: will (predictions and spontaneous decisions), be going to (plans), and the present continuous with a future meaning. Active citizenship and collective responsibility: participation in school campaigns, community decisions, and actions for the common good.",
            "EFL.4.4.d.27. Rights of young people: Convention on the Rights of the Child, rights of participation, protection, and well-being in school and community contexts.",
            "EFL.4.4.d.36. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; the environment; and work.",
            "EFL.4.3.d.12. Short school report: introduction, development, conclusion, organized paragraphs, and basic citation conventions.",
          ],
          procedimentales: [
            "EFL.4.2.p.7. Presents information orally on an academic or community topic with visual support, organizing ideas clearly.",
            "EFL.4.2.p.8. Expresses opinions and justify them briefly with relevant reasons and examples in classroom conversations and discussions.",
            "EFL.4.2.p.11. Sustains discussions and dialogue tables on school and community topics, contributing proposals and concrete examples.",
            "EFL.4.2.p.46. Cooperates with classmates on shared tasks and projects by responsibly distributing roles, resources, and time.",
            "EFL.4.4.p.24. Writes short prevention texts (posters, scripts, informational messages) about natural and human risks, using the imperative and the first conditional.",
            "EFL.4.2.p.47. Plans a campaign, project, or presentation with peers by defining its purpose, audience, stages, and materials.",
            "EFL.4.4.p.25. Writes bulletins, announcements, and short promotional texts to communicate cultural and school activities in an organized manner.",
            "EFL.4.4.p.31. Develops informational materials for school campaigns on the rights of young people, such as posters, brochures, or clear, well-organized messages.",
            "EFL.4.4.p.41. Sets short language-learning goals, records progress, and reflects on the strategies that were used.",
            "EFL.4.4.p.44. Inquires about natural and human-made risks affecting the community, records the information, and produces relevant prevention texts.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks, maintains participation, and acknowledges each person's contributions.",
            "EFL.4.2.a.13. Commits to the classroom's collective agreements and supports peers when they face difficulties during shared work.",
            "EFL.4.4.a.14. Takes responsibility for their learning tasks: plans them, meets deadlines, and communicates obstacles in advance.",
            "EFL.4.4.a.18. Recognizes and values individual and collective practices for preventing natural and human risks as a shared responsibility.",
            "EFL.4.3.a.20. Values the natural environment and the community’s practices of care as part of the common heritage that is inherited and passed on.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.4.2.d.28. Active citizenship and collective responsibility: participation in community decisions, school campaigns, and actions for the common good.",
            "EFL.4.4.d.27. Rights of young people: Convention on the Rights of the Child, rights of participation, protection, and well-being in school and community contexts.",
            "EFL.4.4.d.36. Vocabulary by semantic fields: family and relationships; health and well-being; technology and media; the environment; work; and rights.",
            "EFL.4.3.d.12. Short school report: structure (introduction, development, conclusion), organized paragraphs, and basic citation conventions.",
          ],
          procedimentales: [
            "EFL.4.2.p.7. Presents information orally on an academic or community topic with visual support, organizing ideas clearly.",
            "EFL.4.2.p.8. Expresses opinions and justify them briefly with relevant reasons and examples in classroom conversations and discussions.",
            "EFL.4.2.p.11. Sustains discussions and dialogue tables on school and community topics, contributing proposals and concrete examples.",
            "EFL.4.2.p.46. Cooperates with classmates on shared tasks and projects by responsibly distributing roles, resources, and time.",
            "EFL.4.4.p.24. Writes short prevention texts (posters, scripts, informational messages) about natural and human risks, using the imperative and the first conditional.",
            "EFL.4.2.p.47. Plans a campaign, project, or presentation with peers by defining its purpose, audience, stages, and materials.",
            "EFL.4.4.p.25. Writes bulletins, announcements, and short promotional texts to communicate cultural and school activities in an organized manner.",
            "EFL.4.4.p.31. Develops informational materials for school campaigns on the rights of young people, such as posters, brochures, or clear, well-organized messages.",
            "EFL.4.4.p.41. Sets short language-learning goals, records progress, and reflects on the strategies that were used.",
            "EFL.4.4.p.44. Inquires about natural and human-made risks affecting the community, records the information, and produces relevant prevention texts.",
          ],
          actitudinales: [
            "EFL.4.2.a.10. Cooperates with classmates on group tasks, maintains participation, and acknowledges each person's contributions.",
            "EFL.4.2.a.13. Commits to the classroom's collective agreements and supports peers when they face difficulties during shared work.",
            "EFL.4.4.a.14. Takes responsibility for their learning tasks: plans them, meets deadlines, and communicates obstacles in advance.",
            "EFL.4.4.a.18. Recognizes and values individual and collective practices for preventing natural and human risks as a shared responsibility.",
            "EFL.4.3.a.20. Values the natural environment and the community’s practices of care as part of the common heritage that is inherited and passed on.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.1",
    descripcion: "Expansion of communicative awareness through the analysis of non-verbal language in audiovisual contexts in English, including gestures, facial expressions, and body language, to understand communication as a multimodal process",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.4. Nonverbal and paralinguistic resources in English-language communication: gestures, gaze, facial expressions, and posture.",
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, and Vietnam — their histories with English and distinct voices.",
            "EFL.5.2.d.29. Intercultural awareness in communication: politeness norms and register expectations.",
          ],
          procedimentales: [
            "EFL.5.1.p.3. Understand TV programs, films, and online video content on familiar topics, identifying the setting and characters’ stances.",
            "EFL.5.1.p.4. Identify a speaker’s attitude and opinion in interviews and discussions on familiar topics, using lexical and prosodic cues.",
          ],
          actitudinales: [
            "EFL.5.1.a.1. Show attention and respect when others are speaking in English by maintaining eye contact and waiting for natural pauses before responding.",
            "EFL.5.2.a.4. Show curiosity and openness toward the cultural practices of English-using communities.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.4. Nonverbal and paralinguistic resources in English-language communication: gestures, gaze, facial expressions, posture, and proxemics.",
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, Vietnam, India, Jamaica, Singapore, and Ireland — their histories with English and distinct voices.",
            "EFL.5.2.d.29. Intercultural awareness in communication: politeness norms, register expectations, taboo or sensitive topics, and the cultural specificity of humour and indirectness.",
          ],
          procedimentales: [
            "EFL.5.1.p.3. Understand TV programs, films, and online video content on familiar topics, identifying the setting, characters’ stances, and the emotional tone of exchanges.",
            "EFL.5.1.p.4. Identify a speaker’s attitude, opinion, and degree of certainty in interviews, debates, and discussions, using lexical and prosodic cues.",
          ],
          actitudinales: [
            "EFL.5.1.a.1. Show attention and respect when others are speaking in English by maintaining eye contact, using appropriate backchanneling, and waiting for natural pauses before responding.",
            "EFL.5.2.a.4. Show curiosity and openness toward the cultural practices, values, and perspectives of English-using communities.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.4. Nonverbal and paralinguistic resources in English-language communication: gestures, gaze, facial expressions, posture, proxemics, and their cultural variation across contexts.",
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, Vietnam, India, Jamaica, Singapore, and Ireland — their histories with English, distinct voices, and contributions to global culture and knowledge.",
            "EFL.5.2.d.29. Intercultural awareness in communication: politeness norms, register expectations, taboo or sensitive topics, and the cultural specificity of humour, indirectness, and non-verbal behaviour.",
          ],
          procedimentales: [
            "EFL.5.1.p.3. Understand TV programs, films, and online video content on familiar topics, identifying the setting, characters’ stances, and the emotional tone of exchanges.",
            "EFL.5.1.p.4. Identify a speaker’s attitude, opinion, and degree of certainty in interviews, debates, and discussions, using lexical and prosodic cues.",
          ],
          actitudinales: [
            "EFL.5.1.a.1. Show genuine attention and respect when others are speaking in English by maintaining eye contact, using appropriate backchanneling, and waiting for natural pauses before responding.",
            "EFL.5.2.a.4. Show curiosity and openness toward the cultural practices, values, and perspectives of English-using communities.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.2",
    descripcion: "Development of inclusive communication through a short audio guide for a local cultural exhibition, using guided recording and revision to share local knowledge with English-speaking visitors and to recognize community voices and cultural heritage",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.1. Registers in spoken English — formal and informal — and the vocabulary and formulas that distinguish them across face-to-face interactions.",
            "EFL.5.1.d.3. Prosodic features used for emphasis and contrast: sentence stress on key information, and rising and falling intonation in statements and different question types.",
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, and opinion presentation with visual support — their purpose, audience, and organisational conventions.",
            "EFL.5.1.d.24. Word stress patterns in multisyllabic words: primary stress and stress-shifting pairs (record/record, present/present).",
            "EFL.5.1.d.25. Sentence stress, rhythm, and timing in English as a stress-timed language: nuclear stress on new information and rhythm in natural speech.",
            "EFL.5.1.d.26. Intonation patterns and their communicative values: falling intonation in statements and wh-questions; rising intonation in yes/no questions and lists (except the final item).",
            "EFL.5.1.d.27. Connected speech features: linking between words ending and beginning with consonants and vowels, and weak forms of grammatical words (to, for, of, and, was).",
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, and community traditions.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1, and the distinction between accuracy and fluency.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and organising information into an introduction, main points, and a conclusion with guidance.",
            "EFL.5.2.p.10. Open, maintain, and close conversations in semi-formal contexts such as introductions, service encounters, and school meetings, using appropriate formulas and register.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.2.p.40. Mediate cultural concepts such as practices, values, or references specific to one culture, explaining their meaning to an audience unfamiliar with them.",
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists and self-assessment rubrics.",
            "EFL.5.2.p.45. Describe local landscapes, urban and rural spaces, natural features, and community traditions in English with sensory detail and cultural respect.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues through English with a commitment to respectful participation.",
            "EFL.5.4.a.16. Show commitment to improvement in language production, using feedback from peers and teachers as a resource for growth.",
            "EFL.5.4.a.18. Recognize that language errors are a natural part of learning and show willingness to improve after correction.",
            "EFL.5.4.a.24. Engage with artistic and multimodal production, such as vlogs and photo-essays, as expressive acts that contribute one’s own voice to a shared cultural record.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.1. Registers in spoken English — formal, semi-formal, and informal — and the vocabulary, intonation, and formulas that distinguish them across face-to-face and phone interactions.",
            "EFL.5.1.d.3. Prosodic features used for emphasis and contrast: sentence stress on key information, contrastive stress, rising and falling intonation in statements and different question types, and intonation in tag questions.",
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, opinion presentation with visual support, audio guide, and short video piece with voice-over — their purpose, audience, and organisational conventions.",
            "EFL.5.1.d.24. Word stress patterns in multisyllabic words: primary and secondary stress, stress-shifting pairs (record/record, present/present), and the effect of suffixes on stress placement (-tion, -ic).",
            "EFL.5.1.d.25. Sentence stress, rhythm, and timing in English as a stress-timed language: nuclear stress on new information, contrastive stress for emphasis, and the reduction of unstressed syllables in natural speech.",
            "EFL.5.1.d.26. Intonation patterns and their communicative values: falling intonation in statements and wh-questions; rising intonation in yes/no questions, lists (except the final item), and tag questions expecting confirmation.",
            "EFL.5.1.d.27. Connected speech features: linking between words ending and beginning with consonants and vowels, consonant assimilation, elision of unstressed syllables, and weak forms of grammatical words (to, for, of, and, was, can, have).",
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, community traditions, Afro-Ecuadorian and Indigenous voices, and the principle of Sumak Kawsay / Buen Vivir.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and clearly organising information into an introduction, main points, and a conclusion with increasing independence.",
            "EFL.5.2.p.10. Open, maintain, and close conversations in semi-formal contexts, including school and community meetings, using appropriate formulas and register with increasing independence.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school or community contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.2.p.40. Mediate cultural concepts across two cultural contexts, explaining their meaning and significance to an audience unfamiliar with them.",
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists, self-assessment rubrics, and peer feedback, and adjust strategies as needed.",
            "EFL.5.2.p.45. Describe local landscapes, urban and rural spaces, natural features, and community traditions in English with sensory detail and cultural respect.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues — climate change, gender equality, migration, and digital rights — through English with a commitment to informed and respectful participation.",
            "EFL.5.4.a.16. Show commitment to accuracy and improvement in language production, using feedback from rubrics, peers, and teachers as a resource for growth.",
            "EFL.5.4.a.18. Recognize that language errors are a natural and necessary part of learning, and develop resilience in response to difficulty or correction.",
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, and illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.1. Registers in spoken English — formal, semi-formal, and informal — and the vocabulary, intonation, and formulas that distinguish them across face-to-face, phone, and digital interactions.",
            "EFL.5.1.d.3. Prosodic features used for emphasis and contrast: sentence stress on key information, contrastive stress, rising and falling intonation in statements and different question types, and intonation in tag questions and lists.",
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, opinion presentation with visual support, audio guide, short video piece with voice-over, and vlog episode — their purpose, audience, and organisational conventions.",
            "EFL.5.1.d.24. Word stress patterns in multisyllabic words: primary and secondary stress, stress-shifting pairs (record/record, present/present), and the effect of suffixes on stress placement (-tion, ic, -ity, -ify).",
            "EFL.5.1.d.26. Intonation patterns and their communicative values: falling intonation in statements and wh-questions; rising intonation in yes/no questions, lists (except the final item), and tag questions expecting confirmation; and fall-rise for implication and doubt.",
            "EFL.5.1.d.27. Connected speech features: linking between words ending and beginning with consonants and vowels, consonant assimilation, elision of unstressed syllables, and weak forms of grammatical words (to, for, of, and, was, can, have).",
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, community traditions, Afro-Ecuadorian and Indigenous voices, and the principle of Sumak Kawsay / Buen Vivir as a framework for sustainable living.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and clearly organising information into an introduction, main points, and a conclusion.",
            "EFL.5.2.p.10. Open, maintain, and close conversations in semi-formal contexts — introductions, service encounters, school or community meetings — using appropriate formulas and register.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school or community contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.2.p.40. Mediate cultural concepts — practices, values, or references specific to one culture — across two cultural contexts, explaining their meaning and significance to an audience unfamiliar with them.",
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists, self-assessment rubrics, and peer feedback, and adjust strategies as needed.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues — climate change, gender equality, migration, digital rights — through English with a commitment to informed, respectful, and constructive participation.",
            "EFL.5.4.a.16. Show commitment to accuracy and improvement in language production, using feedback from rubrics, peers, and teachers as a resource for growth rather than a judgment.",
            "EFL.5.4.a.18. Recognize that language errors are a natural and necessary part of learning, and develop resilience and a growth mindset in response to difficulty or correction.",
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.3",
    descripcion: "Creative production of a short, informative video in English on a topic of collective interest, involving planning, recording, editing, and selecting sources, to communicate reliable information to diverse audiences through responsible digital communication",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, and opinion presentation with visual support — their purpose, audience, and organisational conventions.",
            "EFL.5.1.d.27. Connected speech features: linking between words ending and beginning with consonants and vowels, and weak forms of grammatical words (to, for, of, and, was).",
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, date of publication, stated purpose, and evidence quality — applicable to print and digital texts.",
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year) and signal phrases for reported information.",
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather.",
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, and source credibility applied to journalistic articles, social media posts, and advertising; the distinction between information and opinion.",
          ],
          procedimentales: [
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on familiar academic, cultural, and community topics, taking notes using keywords and phrases.",
            "EFL.5.1.p.2. Follow extended instructional videos and short documentary or news sequences in English, distinguishing main events or steps from background detail.",
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, and stated purpose.",
            "EFL.5.4.p.30. Write short video scripts for informative or community-oriented pieces, including voice-over text and basic transition notes.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats.",
            "EFL.5.4.p.34. Integrate visuals and text in multimodal products such as posters and digital publications so that they contribute to the overall message.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps with guidance.",
            "EFL.5.2.p.48. Use AI tools as a language-learning aid, acknowledging AI assistance in schoolwork and comparing AI-generated responses with reliable sources.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, and purpose before using them in written or oral work.",
            "EFL.5.4.p.50. Respect intellectual property in school products by crediting images, texts, sounds, and ideas borrowed from others using simple attribution formats.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, and seeking help when needed.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, opinion presentation with visual support, audio guide, and short video piece with voice-over — their purpose, audience, and organisational conventions.",
            "EFL.5.1.d.27. Connected speech features: linking between words ending and beginning with consonants and vowels, consonant assimilation, elision of unstressed syllables, and weak forms of grammatical words (to, for, of, and, was, can, have).",
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, institutional affiliation, date of publication, stated purpose, evidence quality, and potential bias — applicable to print and digital texts.",
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year), signal phrases for reported information, and the distinction between summary and paraphrase.",
            "EFL.5.2.d.23. Vocabulary in the same semantic fields, with particular attention to collocations and dependent prepositions.",
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, bias, framing, and source credibility applied to journalistic articles, social media posts, advertising, and AI-generated content; the distinction between information, opinion, and misinformation.",
          ],
          procedimentales: [
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on academic, cultural, and community topics, taking notes using keywords and phrases with increasing independence.",
            "EFL.5.1.p.2. Follow extended news programs, documentary sequences, and instructional videos in English, distinguishing main events or steps from background detail with reduced support.",
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, institutional affiliation, and stated purpose.",
            "EFL.5.4.p.30. Write video scripts for short, informative or community-oriented pieces, including stage directions, voice-over text, transition notes, and a clear call to action.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats and explain why the source is reliable.",
            "EFL.5.4.p.34. Integrate visuals and text in multimodal products, including photo-essays and illustrated anthologies, so that each mode contributes meaningfully to the overall message.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps and a time frame.",
            "EFL.5.2.p.48. Use AI tools ethically as a language-learning aid, acknowledging AI assistance in schoolwork, comparing AI-generated responses with reliable sources, and avoiding submitting AI-generated text as one’s own.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, purpose, and evidence quality before using them in written or oral work.",
            "EFL.5.4.p.50. Respect intellectual property in school products by crediting borrowed images, texts, sounds, and ideas using simple attribution formats and basic license information.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, reflecting on progress, and seeking help when needed.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, opinion presentation with visual support, audio guide, short video piece with voice-over, and vlog episode — their purpose, audience, and organisational conventions.",
            "EFL.5.1.d.27. Connected speech features: linking between words ending and beginning with consonants and vowels, consonant assimilation, elision of unstressed syllables, and weak forms of grammatical words (to, for, of, and, was, can, have).",
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, institutional affiliation, date of publication, stated purpose, evidence quality, and potential bias — applicable to print and digital texts, including AI-generated content.",
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year), signal phrases for reported information, and the distinction between summary, paraphrase, and quotation.",
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather — with particular attention to collocations, dependent prepositions, and register variation within each field.",
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, bias, framing, and source credibility applied to journalistic articles, social media posts, advertising, and AI-generated content; the distinction between information, opinion, and misinformation.",
          ],
          procedimentales: [
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on academic, cultural, and community topics, taking notes using keywords and phrases.",
            "EFL.5.1.p.2. Follow extended news programs, documentary sequences, and instructional videos in English, distinguishing main events or steps from background detail.",
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, institutional affiliation, and stated purpose.",
            "EFL.5.4.p.30. Write video scripts for short, informative or community-oriented pieces, including stage directions, voice-over text, transition notes, and a clear call to action.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats (e.g., According to …, Source: …, [Author, Year]) and explain why the source is reliable.",
            "EFL.5.4.p.34. Integrate visuals and text in multimodal products (posters, digital publications, photo-essays, illustrated anthologies) so that each mode contributes meaningfully to the overall message.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps and a time frame.",
            "EFL.5.2.p.48. Use AI tools ethically as a language-learning aid: acknowledge AI assistance in schoolwork, compare AI-generated responses with reliable sources, and avoid submitting AI-generated text as one’s own.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, purpose, and evidence quality before using them in written or oral work.",
            "EFL.5.4.p.50. Respect intellectual property in school products: credit images, texts, sounds, and ideas borrowed from others using simple attribution formats and basic license information.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, reflecting honestly on progress, and proactively seeking help when needed.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.4",
    descripcion: "Transforming written input into oral instructions in English through reformulation, exemplification, and clarification to communicate procedures that support task completion and decision-making, recognizing the link between reading and speaking",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.6. Discourse markers for spoken cohesion: sequencing (first, then, finally, to begin with), contrast (however, on the other hand, although), and cause-result (because of, as a result, therefore).",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could (ability, polite request, permission), should/ought to (advice, expectation), must/mustn’t (obligation, prohibition), and have (got) to (external obligation).",
            "EFL.5.2.d.35. Contrastive linguistics of English: typological differences in word order, articles, and null subject, and false friends.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience and paraphrasing to simplify or clarify.",
          ],
          procedimentales: [
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements to confirm understanding.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information.",
            "EFL.5.2.p.37. Paraphrase an English statement or passage into simpler English or Spanish to clarify its meaning for a peer.",
            "EFL.5.2.p.38. Gloss key terms in English or Spanish so that a reader unfamiliar with the field can follow the text.",
          ],
          actitudinales: [
            "EFL.5.1.a.2. Show willingness to ask for clarification without judgment, recognizing that incomplete understanding is a normal part of language learning.",
            "EFL.5.2.a.6. Value linguistic and cultural diversity as a resource for collective understanding.",
            "EFL.5.2.a.12. Value mediation through summarizing, paraphrasing, glossing, and explaining as a meaningful communicative act that bridges languages.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.6. Discourse markers for spoken cohesion: sequencing, contrast, cause-result, illustration (for example, for instance, such as), and reformulation (in other words, I mean).",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could, will/would, shall, should/ought to, may/might, must/mustn’t, have (got) to, and need/needn’t.",
            "EFL.5.2.d.35. Contrastive linguistics of English: typological differences (word order, articles, null subject, periphrastic verbs), false friends, calques, and syntactic transfer errors.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience; paraphrasing to simplify or clarify; glossing key terms; and explaining culturally specific concepts.",
          ],
          procedimentales: [
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements and paraphrase what others have said to confirm understanding.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information without adding opinion with increasing independence.",
            "EFL.5.2.p.37. Paraphrase a complex English statement or passage into simpler English or Spanish to clarify its meaning for a peer or community member.",
            "EFL.5.2.p.38. Gloss technical, cultural, or discipline-specific key terms in English or Spanish so that a reader unfamiliar with the field can follow the text.",
          ],
          actitudinales: [
            "EFL.5.1.a.2. Demonstrate willingness to ask for and offer clarification without judgment, recognizing that incomplete understanding is a normal and productive part of language learning.",
            "EFL.5.2.a.6. Value linguistic and cultural diversity as a resource for collective understanding, and recognize plurilingualism as a continuous learning process.",
            "EFL.5.2.a.12. Value mediation through summarizing, paraphrasing, glossing, and explaining as a meaningful communicative act that bridges languages and cultures.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.6. Discourse markers for spoken cohesion: sequencing (first, then, finally, to begin with), contrast (however, on the other hand, although), cause-result (because of, as a result, therefore), illustration (for example, for instance, such as), and reformulation (in other words, I mean, what I’m trying to say is).",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could (ability, polite request, permission), will/would (future, polite request, deduction), shall (offer, suggestion), should/ought to (advice, expectation), may/might (possibility), must/mustn’t (obligation, prohibition), have (got) to (external obligation), need/needn’t (necessity, lack of necessity), and used to + infinitive (past habits).",
            "EFL.5.2.d.35. Contrastive linguistics of English: typological differences (word order, articles, null subject, periphrastic verbs), false friends, calques, syntactic transfer errors, and how awareness of these supports accuracy.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience; paraphrasing to simplify or clarify; glossing key terms; and explaining culturally specific concepts.",
          ],
          procedimentales: [
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements and paraphrase what others have said to confirm understanding.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information without adding opinion.",
            "EFL.5.2.p.38. Gloss key terms — technical, cultural, or discipline-specific words — in English or Spanish so that a reader unfamiliar with the field can follow the text.",
          ],
          actitudinales: [
            "EFL.5.1.a.2. Demonstrate willingness to ask for and offer clarification without judgment, recognizing that incomplete understanding is a normal and productive part of language learning.",
            "EFL.5.2.a.6. Value linguistic and cultural diversity as a resource for collective understanding, and recognize plurilingualism as a continuous learning process rather than a destination.",
            "EFL.5.2.a.12. Value mediation — summarizing, paraphrasing, glossing, explaining — is a meaningful communicative act that bridges languages, cultures, and knowledge systems.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.5",
    descripcion: "Interpreting culture by analyzing film trailers, identifying characters, conflicts, visual resources, and evaluative comments, to participate in discussions about cinema and understand how trailers generate expectations",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.4. Nonverbal and paralinguistic resources in English-language communication: gestures, gaze, facial expressions, and posture.",
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, and Vietnam — their histories with English and distinct voices.",
            "EFL.5.1.d.24. Word stress patterns in multisyllabic words: primary stress and stress-shifting pairs (record/record, present/present).",
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle, the magazine article, and the review — their purposes, audiences, and organisational patterns.",
            "EFL.5.2.d.20. Comparatives and superlatives (regular and irregular) with degree modifiers: much/far/a lot + comparative and not as … as; intensifiers (very, quite, rather).",
          ],
          procedimentales: [
            "EFL.5.1.p.3. Understand TV programs, films, and online video content on familiar topics, identifying the setting and characters’ stances.",
            "EFL.5.1.p.2. Follow extended instructional videos and short documentary or news sequences in English, distinguishing main events or steps from background detail.",
            "EFL.5.4.p.26. Produce short reviews of familiar films, books, places, or events using the description-opinion-recommendation structure and evaluative vocabulary.",
          ],
          actitudinales: [
            "EFL.5.2.a.4. Show curiosity and openness toward the cultural practices of English-using communities.",
            "EFL.5.3.a.22. Show appreciation for the aesthetic and expressive possibilities of English as encountered in literature, music, and film.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.4. Nonverbal and paralinguistic resources in English-language communication: gestures, gaze, facial expressions, posture, and proxemics.",
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, Vietnam, India, Jamaica, Singapore, and Ireland — their histories with English and distinct voices.",
            "EFL.5.1.d.24. Word stress patterns in multisyllabic words: primary and secondary stress, stress-shifting pairs (record/record, present/present), and the effect of suffixes on stress placement (-tion, -ic).",
            "EFL.5.2.d.23. Vocabulary in the same semantic fields, with particular attention to collocations and dependent prepositions.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle, the magazine article, the review, and the opinion column with a thesis structure — their purposes, audiences, organisational patterns, and typical language features.",
            "EFL.5.2.d.20. Comparatives and superlatives (regular and irregular) with degree modifiers: much/far/a lot + comparative, not as … as, not … enough to, too … to; and intensifiers (very, quite, rather, extremely, fairly).",
          ],
          procedimentales: [
            "EFL.5.1.p.3. Understand TV programs, films, and online video content on familiar topics, identifying the setting, characters’ stances, and the emotional tone of exchanges.",
            "EFL.5.1.p.2. Follow extended news programs, documentary sequences, and instructional videos in English, distinguishing main events or steps from background detail with reduced support.",
            "EFL.5.4.p.26. Produce reviews of films, books, places, or events using the description-opinion-recommendation structure, evaluative vocabulary, and explicit criteria.",
          ],
          actitudinales: [
            "EFL.5.2.a.4. Show curiosity and openness toward the cultural practices, values, and perspectives of English-using communities.",
            "EFL.5.3.a.22. Show appreciation for the aesthetic and expressive possibilities of English — its rhythms, images, tones, and registers — as encountered in literature, music, film, and everyday language.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.4. Nonverbal and paralinguistic resources in English-language communication: gestures, gaze, facial expressions, posture, proxemics, and their cultural variation across contexts.",
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, Vietnam, India, Jamaica, Singapore, and Ireland — their histories with English, distinct voices, and contributions to global culture and knowledge.",
            "EFL.5.1.d.24. Word stress patterns in multisyllabic words: primary and secondary stress, stress-shifting pairs (record/record, present/present), and the effect of suffixes on stress placement (-tion, ic, -ity, -ify).",
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather — with particular attention to collocations, dependent prepositions, and register variation within each field.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle (narrative-informational hybrid), the magazine article, the review (film, book, place, or event), the opinion column with a thesis structure, and the short literary excerpt — their purposes, audiences, organisational patterns, and typical language features.",
            "EFL.5.2.d.20. Comparatives and superlatives (regular and irregular) with degree modifiers: much/far/a lot + comparative, not as … as, not … enough to, too … to; intensifiers (very, quite, rather, extremely, fairly); and compound adjectives.",
          ],
          procedimentales: [
            "EFL.5.1.p.3. Understand TV programs, films, and online video content on familiar topics, identifying the setting, characters’ stances, and the emotional tone of exchanges.",
            "EFL.5.1.p.2. Follow extended news programs, documentary sequences, and instructional videos in English, distinguishing main events or steps from background detail.",
            "EFL.5.4.p.26. Produce reviews of films, books, places, or events using the description-opinion-recommendation structure, evaluative vocabulary, and explicit criteria.",
          ],
          actitudinales: [
            "EFL.5.2.a.4. Show curiosity and openness toward the cultural practices, values, and perspectives of English-using communities.",
            "EFL.5.3.a.22. Show appreciation for the aesthetic and expressive possibilities of English — its rhythms, images, tones, and registers — as encountered in literature, music, film, and everyday language.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.6",
    descripcion: "Develop argumentative communication by participating in short debates on everyday technologies, supported by reasons and examples, to evaluate different perspectives on technology's impact on daily life",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.1. Registers in spoken English — formal and informal — and the vocabulary and formulas that distinguish them across face-to-face interactions.",
            "EFL.5.1.d.26. Intonation patterns and their communicative values: falling intonation in statements and wh-questions; rising intonation in yes/no questions and lists (except the final item).",
            "EFL.5.2.d.6. Discourse markers for spoken cohesion: sequencing (first, then, finally, to begin with), contrast (however, on the other hand, although), and cause-result (because of, as a result, therefore).",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could (ability, polite request, permission), should/ought to (advice, expectation), must/mustn’t (obligation, prohibition), and have (got) to (external obligation).",
            "EFL.5.2.d.2. Turn-taking strategies in debates and group discussions: yielding and claiming the floor, and signalling that one has finished speaking.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language (according to, it is reported that, in my view, I believe) and basic evaluative language.",
            "EFL.5.2.d.17. Universal truths; Type 1 (If + present simple + will) for real future possibilities; Type 2 (If + past simple + would) for hypothetical or counterfactual situations, including “If I were you”. Conditional sentences: Type 0 for scientific and universal truths and Type 1 (If + present simple + will) for real future possibilities.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, and gender equality and non-discrimination.",
          ],
          procedimentales: [
            "EFL.5.1.p.4. Identify a speaker’s attitude and opinion in interviews and discussions on familiar topics, using lexical and prosodic cues.",
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on familiar academic, cultural, and community topics, taking notes using keywords and phrases.",
            "EFL.5.2.p.8. Explain causes and consequences of familiar social, environmental, or technological issues using Type 1 conditionals, modals, and cause-result connectors.",
            "EFL.5.2.p.9. Sustain an opinion on a familiar topic with at least two reasons and a concrete example.",
            "EFL.5.2.p.11. Participate in structured discussions, agreeing and disagreeing politely and supporting positions with reasons using basic discourse markers.",
            "EFL.5.2.p.15. Use turn-taking signals in group discussions, including holding the floor, yielding, and politely interrupting.",
          ],
          actitudinales: [
            "EFL.5.1.a.1. Show attention and respect when others are speaking in English by maintaining eye contact and waiting for natural pauses before responding.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.1. Registers in spoken English — formal, semi-formal, and informal — and the vocabulary, intonation, and formulas that distinguish them across face-to-face and phone interactions.",
            "EFL.5.1.d.26. Intonation patterns and their communicative values: falling intonation in statements and wh-questions; rising intonation in yes/no questions, lists (except the final item), and tag questions expecting confirmation.",
            "EFL.5.2.d.6. Discourse markers for spoken cohesion: sequencing, contrast, cause-result, illustration (for example, for instance, such as), and reformulation (in other words, I mean).",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could, will/would, shall, should/ought to, may/might, must/mustn’t, have (got) to, and need/needn’t.",
            "EFL.5.2.d.2. Turn-taking strategies in debates and group discussions: yielding, holding, and claiming the floor; backchanneling; and managing interruptions politely.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language, hedging (might, may, could, seems to), and evaluative language (unfortunately, remarkably, clearly).",
            "EFL.5.2.d.17. Conditional sentences: Type 0 for scientific and universal truths; Type 1 (If + present simple + will) for real future possibilities; and Type 2 (If + past simple + would) for hypothetical situations.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, gender equality and non-discrimination, migration and belonging, and digital rights and algorithmic bias.",
          ],
          procedimentales: [
            "EFL.5.1.p.4. Identify a speaker’s attitude, opinion, and degree of certainty in interviews, debates, and discussions, using lexical and prosodic cues.",
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on academic, cultural, and community topics, taking notes using keywords and phrases with increasing independence.",
            "EFL.5.2.p.8. Explain causes and consequences of social, environmental, or technological issues using Type 1 and Type 2 conditionals, modals, and cause-result connectors.",
            "EFL.5.2.p.9. Sustain an opinion on a familiar topic with at least two reasons and a concrete example, acknowledging a counterargument and responding to it.",
            "EFL.5.2.p.11. Participate actively in debates and structured discussions, agreeing and disagreeing politely, using discourse markers and supporting positions with reasons.",
            "EFL.5.2.p.15. Use turn-taking signals effectively, including backchanneling, holding the floor, yielding, politely interrupting, and managing overlapping speech in group discussions.",
          ],
          actitudinales: [
            "EFL.5.1.a.1. Show attention and respect when others are speaking in English by maintaining eye contact, using appropriate backchanneling, and waiting for natural pauses before responding.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.1. Registers in spoken English — formal, semi-formal, and informal — and the vocabulary, intonation, and formulas that distinguish them across face-to-face, phone, and digital interactions.",
            "EFL.5.1.d.26. Intonation patterns and their communicative values: falling intonation in statements and wh-questions; rising intonation in yes/no questions, lists (except the final item), and tag questions expecting confirmation; and fall-rise for implication and doubt.",
            "EFL.5.2.d.6. Discourse markers for spoken cohesion: sequencing (first, then, finally, to begin with), contrast (however, on the other hand, although), cause-result (because of, as a result, therefore), illustration (for example, for instance, such as), and reformulation (in other words, I mean, what I’m trying to say is).",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could (ability, polite request, permission), will/would (future, polite request, deduction), shall (offer, suggestion), should/ought to (advice, expectation), may/might (possibility), must/mustn’t (obligation, prohibition), have (got) to (external obligation), need/needn’t (necessity, lack of necessity), and used to + infinitive (past habits).",
            "EFL.5.2.d.2. Turn-taking strategies in debates and group discussions: yielding, holding, and claiming the floor; backchanneling; managing interruptions politely; and signalling that one has finished speaking.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language (according to, it is reported that, in my view, I believe), hedging (might, may, could, seems to), and evaluative language (unfortunately, remarkably, clearly).",
            "EFL.5.2.d.17. Conditional sentences: Type 0 for scientific and universal truths; Type 1 (If + present simple + will) for real future possibilities; Type 2 (If + past simple + would) for hypothetical or counterfactual situations, including “If I were you”.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, gender equality and non-discrimination, migration and belonging, digital rights and algorithmic bias, and youth civic engagement.",
          ],
          procedimentales: [
            "EFL.5.1.p.4. Identify a speaker’s attitude, opinion, and degree of certainty in interviews, debates, and discussions, using lexical and prosodic cues.",
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on academic, cultural, and community topics, taking notes using keywords and phrases.",
            "EFL.5.2.p.8. Explain causes and consequences of social, environmental, or technological issues using Type 1 and Type 2 conditionals, modals, and cause-result connectors.",
            "EFL.5.2.p.9. Sustain an opinion on a familiar topic with at least two reasons and a concrete example, acknowledging a counterargument and responding to it.",
            "EFL.5.2.p.11. Participate actively in debates and structured discussions, agreeing and disagreeing politely, using discourse markers (I see what you mean, but …; That’s a good point, however …), and supporting positions with reasons.",
            "EFL.5.2.p.15. Use turn-taking signals effectively: backchanneling, holding the floor, yielding, politely interrupting, and managing overlapping speech in group discussions.",
          ],
          actitudinales: [
            "EFL.5.1.a.1. Show genuine attention and respect when others are speaking in English by maintaining eye contact, using appropriate backchanneling, and waiting for natural pauses before responding.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.7",
    descripcion: "Producing video news reports on relevant community events through planning, recording, and guided editing to communicate local perspectives to wider audiences and recognize the value of sharing community narratives",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, and opinion presentation with visual support — their purpose, audience, and organisational conventions.",
            "EFL.5.1.d.25. Sentence stress, rhythm, and timing in English as a stress-timed language: nuclear stress on new information and rhythm in natural speech.",
            "EFL.5.1.d.27. Connected speech features: linking between words ending and beginning with consonants and vowels, and weak forms of grammatical words (to, for, of, and, was).",
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, and community traditions.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1, and the distinction between accuracy and fluency.",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; and past continuous for background actions.",
            "EFL.5.2.d.34. Environmental and community responsibility expressed in English: vocabulary for describing environmental actions and concepts of the rights of nature.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and organising information into an introduction, main points, and a conclusion with guidance.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.1.p.2. Follow extended instructional videos and short documentary or news sequences in English, distinguishing main events or steps from background detail.",
            "EFL.5.4.p.30. Write short video scripts for informative or community-oriented pieces, including voice-over text and basic transition notes.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps with guidance.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing main events from background information in familiar contexts.",
            "EFL.5.2.p.12. Participate in interviews, asking follow-up questions, requesting clarification, and using active listening strategies.",
            "EFL.5.4.p.52. Produce school products responsibly, asking for permission before including another person’s image, voice, or work.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production, such as vlogs and photo-essays, as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.4.a.17. Value self-assessment as a useful tool for learning and engage with it honestly.",
            "EFL.5.2.a.20. Value local knowledge and community practices as sources of insight and wisdom worth sharing in English.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, opinion presentation with visual support, audio guide, and short video piece with voice-over — their purpose, audience, and organisational conventions.",
            "EFL.5.1.d.25. Sentence stress, rhythm, and timing in English as a stress-timed language: nuclear stress on new information, contrastive stress for emphasis, and the reduction of unstressed syllables in natural speech.",
            "EFL.5.1.d.27. Connected speech features: linking between words ending and beginning with consonants and vowels, consonant assimilation, elision of unstressed syllables, and weak forms of grammatical words (to, for, of, and, was, can, have).",
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, community traditions, Afro-Ecuadorian and Indigenous voices, and the principle of Sumak Kawsay / Buen Vivir.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple, present continuous, present perfect simple, past simple, past continuous, past perfect simple for events before a past reference point, and future with will, going to, and shall.",
            "EFL.5.2.d.34. Environmental and community responsibility expressed in English: vocabulary for describing environmental actions; concepts of the rights of nature and Sumak Kawsay; and participation in cause-driven school projects.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and clearly organising information into an introduction, main points, and a conclusion with increasing independence.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school or community contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.1.p.2. Follow extended news programs, documentary sequences, and instructional videos in English, distinguishing main events or steps from background detail with reduced support.",
            "EFL.5.4.p.30. Write video scripts for short, informative or community-oriented pieces, including stage directions, voice-over text, transition notes, and a clear call to action.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps and a time frame.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing background information from the main events with greater independence.",
            "EFL.5.2.p.12. Conduct and respond to interviews, asking follow-up questions, requesting clarification, reformulating answers, and using active listening strategies.",
            "EFL.5.4.p.52. Write, record, or publish school products responsibly, asking for permission before including another person’s image, voice, or work and recognizing the importance of ethical representation.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, and illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.4.a.17. Value self-assessment and peer assessment as useful tools for learning, engaging with them honestly and constructively.",
            "EFL.5.2.a.20. Value local knowledge, ancestral practices, and community voices as sources of insight and wisdom worth documenting and sharing in English.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, opinion presentation with visual support, audio guide, short video piece with voice-over, and vlog episode — their purpose, audience, and organisational conventions.",
            "EFL.5.1.d.27. Connected speech features: linking between words ending and beginning with consonants and vowels, consonant assimilation, elision of unstressed syllables, and weak forms of grammatical words (to, for, of, and, was, can, have).",
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, community traditions, Afro-Ecuadorian and Indigenous voices, and the principle of Sumak Kawsay / Buen Vivir as a framework for sustainable living.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; past continuous for background actions; past perfect simple for events before a past reference point; future with will, going to, and shall; and was/were going to for unfulfilled intentions.",
            "EFL.5.2.d.34. Environmental and community responsibility expressed in English: vocabulary for describing environmental actions; concepts of the rights of nature and Sumak Kawsay; and participation in cause-driven school and community projects.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and clearly organising information into an introduction, main points, and a conclusion.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school or community contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.1.p.2. Follow extended news programs, documentary sequences, and instructional videos in English, distinguishing main events or steps from background detail.",
            "EFL.5.4.p.30. Write video scripts for short, informative or community-oriented pieces, including stage directions, voice-over text, transition notes, and a clear call to action.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps and a time frame.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing background information from the main events.",
            "EFL.5.2.p.12. Conduct and respond to interviews, asking follow-up questions, requesting clarification, reformulating answers, and using active listening strategies.",
            "EFL.5.4.p.52. Write, record, or publish school products responsibly, asking for permission before including another person’s image, voice, or work and recognizing the importance of ethical representation.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.4.a.17. Value self-assessment and peer assessment as fair and useful tools for learning, engaging with them honestly and constructively.",
            "EFL.5.2.a.20. Value local knowledge, ancestral practices, and community voices as sources of insight and wisdom worth documenting and sharing in English.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.8",
    descripcion: "Producing a short video blog on local historical heritage through on-site recording and narration to present how heritage is experienced and valued within the community and to strengthen awareness of local identity",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, and opinion presentation with visual support — their purpose, audience, and organisational conventions.",
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, and community traditions.",
            "EFL.5.2.d.6. Discourse markers for spoken cohesion: sequencing (first, then, finally, to begin with), contrast (however, on the other hand, although), and cause-result (because of, as a result, therefore).",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; and past continuous for background actions.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, and compound nouns.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and organising information into an introduction, main points, and a conclusion with guidance.",
            "EFL.5.2.p.40. Mediate cultural concepts such as practices, values, or references specific to one culture, explaining their meaning to an audience unfamiliar with them.",
            "EFL.5.4.p.30. Write short video scripts for informative or community-oriented pieces, including voice-over text and basic transition notes.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing main events from background information in familiar contexts.",
            "EFL.5.2.p.12. Participate in interviews, asking follow-up questions, requesting clarification, and using active listening strategies.",
            "EFL.5.4.p.52. Produce school products responsibly, asking for permission before including another person’s image, voice, or work.",
            "EFL.5.2.p.6. Describe experiences and memories using a range of tenses, basic discourse markers, and evaluative vocabulary.",
            "EFL.5.4.p.25. Write autobiographical narratives and biographical texts using first- or third-person narration, past tense, and chronological organization.",
            "EFL.5.4.p.29. Produce captions and accompanying text for photo essays and vlogs that integrate visual and written information coherently.",
            "EFL.5.2.p.47. Use English to participate in local cause-driven projects, contributing short written and spoken texts to shared community purposes.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production, such as vlogs and photo-essays, as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.2.a.20. Value local knowledge and community practices as sources of insight and wisdom worth sharing in English.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, opinion presentation with visual support, audio guide, and short video piece with voice-over — their purpose, audience, and organisational conventions.",
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, community traditions, Afro-Ecuadorian and Indigenous voices, and the principle of Sumak Kawsay / Buen Vivir.",
            "EFL.5.2.d.6. Discourse markers for spoken cohesion: sequencing, contrast, cause-result, illustration (for example, for instance, such as), and reformulation (in other words, I mean).",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple, present continuous, present perfect simple, past simple, past continuous, past perfect simple for events before a past reference point, and future with will, going to, and shall.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, compound nouns, complex noun phrases, and genitive (‘s, s’, double genitive).",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and clearly organising information into an introduction, main points, and a conclusion with increasing independence.",
            "EFL.5.2.p.40. Mediate cultural concepts across two cultural contexts, explaining their meaning and significance to an audience unfamiliar with them.",
            "EFL.5.4.p.30. Write video scripts for short, informative or community-oriented pieces, including stage directions, voice-over text, transition notes, and a clear call to action.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing background information from the main events with greater independence.",
            "EFL.5.2.p.12. Conduct and respond to interviews, asking follow-up questions, requesting clarification, reformulating answers, and using active listening strategies.",
            "EFL.5.4.p.52. Write, record, or publish school products responsibly, asking for permission before including another person’s image, voice, or work and recognizing the importance of ethical representation.",
            "EFL.5.2.p.6. Describe experiences, memories, dreams, and future ambitions using a range of tenses, discourse markers, and evaluative vocabulary.",
            "EFL.5.4.p.25. Write autobiographical narratives and biographical texts using first- or third-person narration, past tense, chronological organization, and evaluative reflection on events.",
            "EFL.5.4.p.29. Produce captions and accompanying text for photo essays and vlogs that integrate visual and written information coherently, citing sources.",
            "EFL.5.2.p.47. Use English to participate in local and global cause-driven projects, contributing written and spoken texts to shared community purposes.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, and illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.2.a.20. Value local knowledge, ancestral practices, and community voices as sources of insight and wisdom worth documenting and sharing in English.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.5. Oral and multimodal genres: structured interview, personal anecdote, opinion presentation with visual support, audio guide, short video piece with voice-over, and vlog episode — their purpose, audience, and organisational conventions.",
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, community traditions, Afro-Ecuadorian and Indigenous voices, and the principle of Sumak Kawsay / Buen Vivir as a framework for sustainable living.",
            "EFL.5.2.d.6. Discourse markers for spoken cohesion: sequencing (first, then, finally, to begin with), contrast (however, on the other hand, although), cause-result (because of, as a result, therefore), illustration (for example, for instance, such as), and reformulation (in other words, I mean, what I’m trying to say is).",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; past continuous for background actions; past perfect simple for events before a past reference point; future with will, going to, and shall; and was/were going to for unfulfilled intentions.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, compound nouns, complex noun phrases, genitive (‘s, s’, double genitive), and relative clauses with who, which, and that.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and clearly organising information into an introduction, main points, and a conclusion.",
            "EFL.5.2.p.40. Mediate cultural concepts — practices, values, or references specific to one culture — across two cultural contexts, explaining their meaning and significance to an audience unfamiliar with them.",
            "EFL.5.4.p.30. Write video scripts for short, informative or community-oriented pieces, including stage directions, voice-over text, transition notes, and a clear call to action.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing background information from the main events.",
            "EFL.5.2.p.12. Conduct and respond to interviews, asking follow-up questions, requesting clarification, reformulating answers, and using active listening strategies.",
            "EFL.5.4.p.52. Write, record, or publish school products responsibly, asking for permission before including another person’s image, voice, or work and recognizing the importance of ethical representation.",
            "EFL.5.2.p.6. Describe experiences, memories, dreams, and future ambitions using a range of tenses, discourse markers, and evaluative vocabulary.",
            "EFL.5.4.p.25. Write autobiographical narratives and biographical texts using first- or third-person narration, past tense, chronological organization, and evaluative reflection on events.",
            "EFL.5.4.p.29. Produce captions and accompanying text for photo essays and vlogs that integrate visual and written information coherently, citing sources and crediting contributors.",
            "EFL.5.2.p.47. Use English to participate in local and global cause-driven projects — anti-discrimination campaigns, environmental initiatives, heritage documentation — contributing written and spoken texts to shared community purposes.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.2.a.20. Value local knowledge, ancestral practices, and community voices as sources of insight and wisdom worth documenting and sharing in English.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.9",
    descripcion: "Collectively organizing an English-language song recital, including role assignment, transitions, and rehearsal, to participate in a cultural school event and recognize music as a form of shared expression",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.4. Nonverbal and paralinguistic resources in English-language communication: gestures, gaze, facial expressions, and posture.",
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, and Vietnam — their histories with English and distinct voices.",
            "EFL.5.1.d.1. Registers in spoken English — formal and informal — and the vocabulary and formulas that distinguish them across face-to-face interactions.",
            "EFL.5.1.d.3. Prosodic features used for emphasis and contrast: sentence stress on key information, and rising and falling intonation in statements and different question types.",
            "EFL.5.1.d.25. Sentence stress, rhythm, and timing in English as a stress-timed language: nuclear stress on new information and rhythm in natural speech.",
            "EFL.5.1.d.26. Intonation patterns and their communicative values: falling intonation in statements and wh-questions; rising intonation in yes/no questions and lists (except the final item).",
          ],
          procedimentales: [
            "EFL.5.3.p.22. Read short literary excerpts, identifying themes, narrative voice, and setting.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production, such as vlogs and photo-essays, as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.3.a.22. Show appreciation for the aesthetic and expressive possibilities of English as encountered in literature, music, and film.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices to participate.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.4. Nonverbal and paralinguistic resources in English-language communication: gestures, gaze, facial expressions, posture, and proxemics.",
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, Vietnam, India, Jamaica, Singapore, and Ireland — their histories with English and distinct voices.",
            "EFL.5.1.d.1. Registers in spoken English — formal, semi-formal, and informal — and the vocabulary, intonation, and formulas that distinguish them across face-to-face and phone interactions.",
            "EFL.5.1.d.3. Prosodic features used for emphasis and contrast: sentence stress on key information, contrastive stress, rising and falling intonation in statements and different question types, and intonation in tag questions.",
            "EFL.5.1.d.25. Sentence stress, rhythm, and timing in English as a stress-timed language: nuclear stress on new information, contrastive stress for emphasis, and the reduction of unstressed syllables in natural speech.",
            "EFL.5.1.d.26. Intonation patterns and their communicative values: falling intonation in statements and wh-questions; rising intonation in yes/no questions, lists (except the final item), and tag questions expecting confirmation.",
          ],
          procedimentales: [
            "EFL.5.3.p.22. Read short literary excerpts — stories, autobiographical fragments, song lyrics — and identify themes, narrative voice, setting, and the ways the author creates meaning.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, and illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.3.a.22. Show appreciation for the aesthetic and expressive possibilities of English — its rhythms, images, tones, and registers — as encountered in literature, music, film, and everyday language.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices and creating space for everyone to participate.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.4. Nonverbal and paralinguistic resources in English-language communication: gestures, gaze, facial expressions, posture, proxemics, and their cultural variation across contexts.",
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, Vietnam, India, Jamaica, Singapore, and Ireland — their histories with English, distinct voices, and contributions to global culture and knowledge.",
            "EFL.5.1.d.1. Registers in spoken English — formal, semi-formal, and informal — and the vocabulary, intonation, and formulas that distinguish them across face-to-face, phone, and digital interactions.",
            "EFL.5.1.d.3. Prosodic features used for emphasis and contrast: sentence stress on key information, contrastive stress, rising and falling intonation in statements and different question types, and intonation in tag questions and lists.",
            "EFL.5.1.d.26. Intonation patterns and their communicative values: falling intonation in statements and wh-questions; rising intonation in yes/no questions, lists (except the final item), and tag questions expecting confirmation; and fall-rise for implication and doubt.",
          ],
          procedimentales: [
            "EFL.5.3.p.22. Read short literary excerpts — stories, autobiographical fragments, song lyrics — and identify themes, narrative voice, setting, and the ways the author creates meaning.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.3.a.22. Show appreciation for the aesthetic and expressive possibilities of English — its rhythms, images, tones, and registers — as encountered in literature, music, film, and everyday language.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices and creating space for everyone to participate.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.10",
    descripcion: "Reading short journalistic chronicles in English on social, cultural, and environmental topics comprehensively, identifying narrative voice, sources, and perspectives to understand journalism as both information and narrative construction",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, and source credibility applied to journalistic articles, social media posts, and advertising; the distinction between information and opinion.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle, the magazine article, and the review — their purposes, audiences, and organisational patterns.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language (according to, it is reported that, in my view, I believe) and basic evaluative language.",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; and past continuous for background actions.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, and compound nouns.",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although), cause (because, since, as), result (therefore, as a result, so), addition (in addition, furthermore), and exemplification (for example, for instance, such as).",
          ],
          procedimentales: [
            "EFL.5.3.p.16. Read journalistic chronicles, magazine articles, and online blogs, identifying the main idea and supporting details.",
            "EFL.5.3.p.17. Infer the meanings of unknown words from context clues and prior knowledge.",
            "EFL.5.3.p.18. Identify the author’s purpose and point of view in informational and argumentative texts.",
            "EFL.5.3.p.19. Distinguish basic differences between facts and opinions in news reports, opinion columns, and reviews, using signal language as a guide.",
            "EFL.5.3.p.21. Compare two short texts on the same topic, identifying shared ideas and differences in framing.",
            "EFL.5.4.p.23. Compose short journalistic chronicles that integrate narrative and informational elements, including scene-setting, a narrative voice, and sources.",
          ],
          actitudinales: [
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts beyond those assigned in class.",
            "EFL.5.3.a.9. Show persistence in navigating unfamiliar texts by using context clues and available resources rather than immediately seeking a translation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, bias, framing, and source credibility applied to journalistic articles, social media posts, advertising, and AI-generated content; the distinction between information, opinion, and misinformation.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle, the magazine article, the review, and the opinion column with a thesis structure — their purposes, audiences, organisational patterns, and typical language features.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language, hedging (might, may, could, seems to), and evaluative language (unfortunately, remarkably, clearly).",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple, present continuous, present perfect simple, past simple, past continuous, past perfect simple for events before a past reference point, and future with will, going to, and shall.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, compound nouns, complex noun phrases, and genitive (‘s, s’, double genitive).",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, cohesive devices (reference, substitution, conjunction, lexical chains), and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), and concession (even though, despite).",
          ],
          procedimentales: [
            "EFL.5.3.p.16. Read journalistic chronicles, magazine articles, and online blogs, identifying the main idea, supporting details, and the author’s purpose.",
            "EFL.5.3.p.17. Infer the meanings of unknown words and implied meanings from context clues, textual organization, and prior knowledge.",
            "EFL.5.3.p.18. Identify and evaluate the author’s purpose and point of view in informational and argumentative texts, considering the evidence used.",
            "EFL.5.3.p.19. Distinguish facts from opinions in news reports, opinion columns, and reviews, using signal language and hedging markers as guides.",
            "EFL.5.3.p.21. Synthesize information across two short texts on the same topic, identifying shared ideas, differences in framing, and points of complementarity.",
            "EFL.5.4.p.23. Compose journalistic chronicles that integrate narrative and informational elements, including scene-setting, a narrative voice, sources, and a conclusion that connects the event to a broader issue.",
          ],
          actitudinales: [
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts — literary, journalistic, scientific, and multimodal — beyond those assigned in class.",
            "EFL.5.3.a.9. Show persistence in navigating unfamiliar texts by using context clues, inference, and available resources rather than immediately seeking a translation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, bias, framing, and source credibility applied to journalistic articles, social media posts, advertising, and AI-generated content; the distinction between information, opinion, and misinformation.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle (narrative-informational hybrid), the magazine article, the review (film, book, place, or event), the opinion column with a thesis structure, and the short literary excerpt — their purposes, audiences, organisational patterns, and typical language features.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language (according to, it is reported that, in my view, I believe), hedging (might, may, could, seems to), and evaluative language (unfortunately, remarkably, clearly).",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; past continuous for background actions; past perfect simple for events before a past reference point; future with will, going to, and shall; and was/were going to for unfulfilled intentions.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, compound nouns, complex noun phrases, genitive (‘s, s’, double genitive), and relative clauses with who, which, and that.",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, cohesive devices (reference, substitution, conjunction, lexical chains), and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), concession (even though, despite, despite), and condition (if, unless, provided that).",
          ],
          procedimentales: [
            "EFL.5.3.p.16. Read journalistic chronicles, magazine articles, and online blogs, identifying the main idea, supporting details, and the author’s purpose and stance.",
            "EFL.5.3.p.17. Infer the meanings of unknown words and implied meanings from context clues, textual organization, and prior knowledge.",
            "EFL.5.3.p.18. Identify and evaluate the author’s purpose, point of view, and use of evidence in informational and argumentative texts.",
            "EFL.5.3.p.19. Begin to distinguish facts from opinions in news reports, opinion columns, and reviews, using signal language and hedging markers as guides.",
            "EFL.5.3.p.21. Synthesize information across two short texts on the same topic, identifying shared ideas, differences in framing, and points of complementarity.",
            "EFL.5.4.p.23. Compose journalistic chronicles that integrate narrative and informational elements, include scene-setting, a narrative voice, sources, and a conclusion that connects the event to a broader issue.",
          ],
          actitudinales: [
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts — literary, journalistic, scientific, multimodal — beyond those assigned in class.",
            "EFL.5.3.a.9. Show persistence in navigating unfamiliar texts by using context clues, inference, and available resources rather than immediately seeking a translation.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.11",
    descripcion: "Developing socio-emotional awareness by reading short magazine articles on adolescent-related topics, identifying perspectives, experiences, and testimonies, and relating personal well-being to social conditions",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.29. Intercultural awareness in communication: politeness norms and register expectations.",
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle, the magazine article, and the review — their purposes, audiences, and organisational patterns.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, and gender equality and non-discrimination.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, and compound nouns.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although), cause (because, since, as), result (therefore, as a result, so), addition (in addition, furthermore), and exemplification (for example, for instance, such as).",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, and identifying the main idea versus supporting details.",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; and gerund as subject or object.",
          ],
          procedimentales: [
            "EFL.5.2.p.9. Sustain an opinion on a familiar topic with at least two reasons and a concrete example.",
            "EFL.5.2.p.11. Participate in structured discussions, agreeing and disagreeing politely and supporting positions with reasons using basic discourse markers.",
            "EFL.5.2.p.6. Describe experiences and memories using a range of tenses, basic discourse markers, and evaluative vocabulary.",
            "EFL.5.3.p.16. Read journalistic chronicles, magazine articles, and online blogs, identifying the main idea and supporting details.",
            "EFL.5.4.p.43. Record and recycle new vocabulary using vocabulary notebooks and flashcard systems, organizing entries by topic and example sentences.",
          ],
          actitudinales: [
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts beyond those assigned in class.",
            "EFL.5.3.a.5. Recognize cultural stereotypes and unfair representations in texts and media, and identify the harm they can cause to individuals.",
            "EFL.5.3.a.10. Value reading as a way to encounter different lives and perspectives, and recognize literature as a way to understand one’s own experience and that of others.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.29. Intercultural awareness in communication: politeness norms, register expectations, taboo or sensitive topics, and the cultural specificity of humour and indirectness.",
            "EFL.5.2.d.23. Vocabulary in the same semantic fields, with particular attention to collocations and dependent prepositions.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle, the magazine article, the review, and the opinion column with a thesis structure — their purposes, audiences, organisational patterns, and typical language features.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, gender equality and non-discrimination, migration and belonging, and digital rights and algorithmic bias.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, compound nouns, complex noun phrases, and genitive (‘s, s’, double genitive).",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), and concession (even though, despite).",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, inferring meaning from context clues, identifying the main idea versus supporting details, and recognising the text type.",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; gerund as subject or object; phrasal verbs and verbs with prepositions.",
          ],
          procedimentales: [
            "EFL.5.2.p.9. Sustain an opinion on a familiar topic with at least two reasons and a concrete example, acknowledging a counterargument and responding to it.",
            "EFL.5.2.p.11. Participate actively in debates and structured discussions, agreeing and disagreeing politely, using discourse markers and supporting positions with reasons.",
            "EFL.5.2.p.6. Describe experiences, memories, dreams, and future ambitions using a range of tenses, discourse markers, and evaluative vocabulary.",
            "EFL.5.3.p.16. Read journalistic chronicles, magazine articles, and online blogs, identifying the main idea, supporting details, and the author’s purpose.",
            "EFL.5.4.p.43. Record and recycle new vocabulary systematically using vocabulary notebooks, flashcard systems, and spaced repetition, organizing entries by topic, collocations, and example sentences.",
          ],
          actitudinales: [
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts — literary, journalistic, scientific, and multimodal — beyond those assigned in class.",
            "EFL.5.3.a.5. Recognize and reject cultural stereotypes and unfair representations in texts and media, and identify the harm they can cause to communities and individuals.",
            "EFL.5.3.a.10. Value the act of reading as a way to encounter different lives, perspectives, and questions, and recognize literature as a way to understand one’s own experience and that of others.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.29. Intercultural awareness in communication: politeness norms, register expectations, taboo or sensitive topics, and the cultural specificity of humour, indirectness, and non-verbal behaviour.",
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather — with particular attention to collocations, dependent prepositions, and register variation within each field.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle (narrative-informational hybrid), the magazine article, the review (film, book, place, or event), the opinion column with a thesis structure, and the short literary excerpt — their purposes, audiences, organisational patterns, and typical language features.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, gender equality and non-discrimination, migration and belonging, digital rights and algorithmic bias, and youth civic engagement.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, compound nouns, complex noun phrases, genitive (‘s, s’, double genitive), and relative clauses with who, which, and that.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), concession (even though, despite, despite), and condition (if, unless, provided that).",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, inferring meaning from context clues, identifying the main idea versus supporting details, and recognising the text type and the author’s purpose.",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; gerund as subject or object; phrasal verbs and verbs with prepositions; and verb + object + infinitive patterns (give/take/send + direct/indirect object).",
          ],
          procedimentales: [
            "EFL.5.2.p.9. Sustain an opinion on a familiar topic with at least two reasons and a concrete example, acknowledging a counterargument and responding to it.",
            "EFL.5.2.p.11. Participate actively in debates and structured discussions, agreeing and disagreeing politely, using discourse markers (I see what you mean, but …; That’s a good point, however …), and supporting positions with reasons.",
            "EFL.5.2.p.6. Describe experiences, memories, dreams, and future ambitions using a range of tenses, discourse markers, and evaluative vocabulary.",
            "EFL.5.3.p.16. Read journalistic chronicles, magazine articles, and online blogs, identifying the main idea, supporting details, and the author’s purpose and stance.",
            "EFL.5.4.p.43. Record and recycle new vocabulary systematically using vocabulary notebooks, flashcard systems, and spaced repetition, organizing entries by topic, collocations, and example sentences.",
          ],
          actitudinales: [
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts — literary, journalistic, scientific, multimodal — beyond those assigned in class.",
            "EFL.5.3.a.5. Recognize and reject cultural stereotypes and unfair representations in texts and media, and name the harm they can cause to communities and individuals.",
            "EFL.5.3.a.10. Value the act of reading as a way to encounter different lives, perspectives, and questions, and recognize literature as both a mirror and a window for understanding one’s own experience and that of others.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.12",
    descripcion: "Collaboratively interpreting flowcharts for project planning, identifying stages, decisions, and outcomes, to understand and discuss collective processes and to recognize planning as a shared practice",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.1. Registers in spoken English — formal and informal — and the vocabulary and formulas that distinguish them across face-to-face interactions.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience and paraphrasing to simplify or clarify.",
            "EFL.5.2.d.2. Turn-taking strategies in debates and group discussions: yielding and claiming the floor, and signalling that one has finished speaking.",
          ],
          procedimentales: [
            "EFL.5.2.p.10. Open, maintain, and close conversations in semi-formal contexts such as introductions, service encounters, and school meetings, using appropriate formulas and register.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements to confirm understanding.",
            "EFL.5.2.p.37. Paraphrase an English statement or passage into simpler English or Spanish to clarify its meaning for a peer.",
            "EFL.5.2.p.11. Participate in structured discussions, agreeing and disagreeing politely and supporting positions with reasons using basic discourse markers.",
            "EFL.5.2.p.15. Use turn-taking signals in group discussions, including holding the floor, yielding, and politely interrupting.",
            "EFL.5.2.p.13. Negotiate simple plans and services, expressing preferences and suggesting alternatives using modal verbs.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, and help peers express their ideas.",
          ],
          actitudinales: [
            "EFL.5.1.a.1. Show attention and respect when others are speaking in English by maintaining eye contact and waiting for natural pauses before responding.",
            "EFL.5.1.a.2. Show willingness to ask for clarification without judgment, recognizing that incomplete understanding is a normal part of language learning.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices to participate.",
            "EFL.5.2.a.11. Demonstrate empathy toward peers who use English differently, supporting rather than correcting in ways that discourage participation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.1. Registers in spoken English — formal, semi-formal, and informal — and the vocabulary, intonation, and formulas that distinguish them across face-to-face and phone interactions.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience; paraphrasing to simplify or clarify; glossing key terms; and explaining culturally specific concepts.",
            "EFL.5.2.d.2. Turn-taking strategies in debates and group discussions: yielding, holding, and claiming the floor; backchanneling; and managing interruptions politely.",
          ],
          procedimentales: [
            "EFL.5.2.p.10. Open, maintain, and close conversations in semi-formal contexts, including school and community meetings, using appropriate formulas and register with increasing independence.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school or community contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements and paraphrase what others have said to confirm understanding.",
            "EFL.5.2.p.37. Paraphrase a complex English statement or passage into simpler English or Spanish to clarify its meaning for a peer or community member.",
            "EFL.5.2.p.11. Participate actively in debates and structured discussions, agreeing and disagreeing politely, using discourse markers and supporting positions with reasons.",
            "EFL.5.2.p.15. Use turn-taking signals effectively, including backchanneling, holding the floor, yielding, politely interrupting, and managing overlapping speech in group discussions.",
            "EFL.5.2.p.13. Negotiate plans and services, expressing preferences, suggesting alternatives, and reaching agreements using modal verbs and conditional structures.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, give and receive constructive feedback, and help peers express their ideas.",
          ],
          actitudinales: [
            "EFL.5.1.a.1. Show attention and respect when others are speaking in English by maintaining eye contact, using appropriate backchanneling, and waiting for natural pauses before responding.",
            "EFL.5.1.a.2. Demonstrate willingness to ask for and offer clarification without judgment, recognizing that incomplete understanding is a normal and productive part of language learning.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices and creating space for everyone to participate.",
            "EFL.5.2.a.11. Demonstrate empathy toward peers and community members who use English differently, supporting rather than correcting in ways that discourage participation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.1. Registers in spoken English — formal, semi-formal, and informal — and the vocabulary, intonation, and formulas that distinguish them across face-to-face, phone, and digital interactions.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience; paraphrasing to simplify or clarify; glossing key terms; and explaining culturally specific concepts.",
            "EFL.5.2.d.2. Turn-taking strategies in debates and group discussions: yielding, holding, and claiming the floor; backchanneling; managing interruptions politely; and signalling that one has finished speaking.",
          ],
          procedimentales: [
            "EFL.5.2.p.10. Open, maintain, and close conversations in semi-formal contexts — introductions, service encounters, school or community meetings — using appropriate formulas and register.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school or community contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements and paraphrase what others have said to confirm understanding.",
            "EFL.5.2.p.11. Participate actively in debates and structured discussions, agreeing and disagreeing politely, using discourse markers (I see what you mean, but …; That’s a good point, however …), and supporting positions with reasons.",
            "EFL.5.2.p.15. Use turn-taking signals effectively: backchanneling, holding the floor, yielding, politely interrupting, and managing overlapping speech in group discussions.",
            "EFL.5.2.p.13. Negotiate plans and services, expressing preferences, suggesting alternatives, and reaching agreements using modal verbs and conditional structures.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, give and receive constructive feedback, and help peers express their ideas.",
          ],
          actitudinales: [
            "EFL.5.1.a.1. Show genuine attention and respect when others are speaking in English by maintaining eye contact, using appropriate backchanneling, and waiting for natural pauses before responding.",
            "EFL.5.1.a.2. Demonstrate willingness to ask for and offer clarification without judgment, recognizing that incomplete understanding is a normal and productive part of language learning.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices and creating space for everyone to participate.",
            "EFL.5.2.a.11. Demonstrate empathy toward peers and community members who use English differently, supporting rather than correcting in ways that discourage participation.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.13",
    descripcion: "Developing critical awareness of digital tools by reading texts on the ethical use of artificial intelligence and language models, identifying guidelines and recommendations, and fostering responsible, informed use of digital technologies",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, date of publication, stated purpose, and evidence quality — applicable to print and digital texts.",
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, and source credibility applied to journalistic articles, social media posts, and advertising; the distinction between information and opinion.",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could (ability, polite request, permission), should/ought to (advice, expectation), must/mustn’t (obligation, prohibition), and have (got) to (external obligation).",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language (according to, it is reported that, in my view, I believe) and basic evaluative language.",
            "EFL.5.2.d.17. Universal truths; Type 1 (If + present simple + will) for real future possibilities; Type 2 (If + past simple + would) for hypothetical or counterfactual situations, including “If I were you”. Conditional sentences: Type 0 for scientific and universal truths and Type 1 (If + present simple + will) for real future possibilities.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, and gender equality and non-discrimination.",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, and identifying the main idea versus supporting details.",
            "EFL.5.4.d.16. Passive voice: present simple passive and past simple passive for informational and scientific register.",
            "EFL.5.3.d.33. Responsible and ethical use of AI and digital tools for language learning: citing AI assistance and avoiding plagiarism.",
          ],
          procedimentales: [
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, and stated purpose.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats.",
            "EFL.5.2.p.48. Use AI tools as a language-learning aid, acknowledging AI assistance in schoolwork and comparing AI-generated responses with reliable sources.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, and purpose before using them in written or oral work.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information.",
            "EFL.5.2.p.38. Gloss key terms in English or Spanish so that a reader unfamiliar with the field can follow the text.",
            "EFL.5.2.p.8. Explain causes and consequences of familiar social, environmental, or technological issues using Type 1 conditionals, modals, and cause-result connectors.",
            "EFL.5.2.p.9. Sustain an opinion on a familiar topic with at least two reasons and a concrete example.",
            "EFL.5.3.p.17. Infer the meanings of unknown words from context clues and prior knowledge.",
            "EFL.5.3.p.18. Identify the author’s purpose and point of view in informational and argumentative texts.",
            "EFL.5.3.p.19. Distinguish basic differences between facts and opinions in news reports, opinion columns, and reviews, using signal language as a guide.",
            "EFL.5.4.p.24. Write opinion paragraphs with a clear thesis statement, supporting reasons, and examples.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues through English with a commitment to respectful participation.",
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts beyond those assigned in class.",
            "EFL.5.3.a.9. Show persistence in navigating unfamiliar texts by using context clues and available resources rather than immediately seeking a translation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, institutional affiliation, date of publication, stated purpose, evidence quality, and potential bias — applicable to print and digital texts.",
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, bias, framing, and source credibility applied to journalistic articles, social media posts, advertising, and AI-generated content; the distinction between information, opinion, and misinformation.",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could, will/would, shall, should/ought to, may/might, must/mustn’t, have (got) to, and need/needn’t.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language, hedging (might, may, could, seems to), and evaluative language (unfortunately, remarkably, clearly).",
            "EFL.5.2.d.17. Conditional sentences: Type 0 for scientific and universal truths; Type 1 (If + present simple + will) for real future possibilities; and Type 2 (If + past simple + would) for hypothetical situations.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, gender equality and non-discrimination, migration and belonging, and digital rights and algorithmic bias.",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, inferring meaning from context clues, identifying the main idea versus supporting details, and recognising the text type.",
            "EFL.5.4.d.16. Passive voice: present simple passive and past simple passive for informational and scientific register, and modal passive (should be done, must be checked).",
            "EFL.5.3.d.33. Responsible and ethical use of AI and digital tools for language learning: citing AI assistance, comparing AI output with reliable human sources, avoiding plagiarism, and recognizing when AI-generated content may exclude or misrepresent local communities.",
          ],
          procedimentales: [
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, institutional affiliation, and stated purpose.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats and explain why the source is reliable.",
            "EFL.5.2.p.48. Use AI tools ethically as a language-learning aid, acknowledging AI assistance in schoolwork, comparing AI-generated responses with reliable sources, and avoiding submitting AI-generated text as one’s own.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, purpose, and evidence quality before using them in written or oral work.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information without adding opinion with increasing independence.",
            "EFL.5.2.p.38. Gloss technical, cultural, or discipline-specific key terms in English or Spanish so that a reader unfamiliar with the field can follow the text.",
            "EFL.5.2.p.8. Explain causes and consequences of social, environmental, or technological issues using Type 1 and Type 2 conditionals, modals, and cause-result connectors.",
            "EFL.5.2.p.9. Sustain an opinion on a familiar topic with at least two reasons and a concrete example, acknowledging a counterargument and responding to it.",
            "EFL.5.3.p.17. Infer the meanings of unknown words and implied meanings from context clues, textual organization, and prior knowledge.",
            "EFL.5.3.p.18. Identify and evaluate the author’s purpose and point of view in informational and argumentative texts, considering the evidence used.",
            "EFL.5.3.p.19. Distinguish facts from opinions in news reports, opinion columns, and reviews, using signal language and hedging markers as guides.",
            "EFL.5.4.p.24. Write opinion columns with a clear thesis statement, two to three supporting reasons with examples, and a conclusion that restates the thesis in new words.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues — climate change, gender equality, migration, and digital rights — through English with a commitment to informed and respectful participation.",
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts — literary, journalistic, scientific, and multimodal — beyond those assigned in class.",
            "EFL.5.3.a.9. Show persistence in navigating unfamiliar texts by using context clues, inference, and available resources rather than immediately seeking a translation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, institutional affiliation, date of publication, stated purpose, evidence quality, and potential bias — applicable to print and digital texts, including AI-generated content.",
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, bias, framing, and source credibility applied to journalistic articles, social media posts, advertising, and AI-generated content; the distinction between information, opinion, and misinformation.",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could (ability, polite request, permission), will/would (future, polite request, deduction), shall (offer, suggestion), should/ought to (advice, expectation), may/might (possibility), must/mustn’t (obligation, prohibition), have (got) to (external obligation), need/needn’t (necessity, lack of necessity), and used to + infinitive (past habits).",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language (according to, it is reported that, in my view, I believe), hedging (might, may, could, seems to), and evaluative language (unfortunately, remarkably, clearly).",
            "EFL.5.2.d.17. Conditional sentences: Type 0 for scientific and universal truths; Type 1 (If + present simple + will) for real future possibilities; Type 2 (If + past simple + would) for hypothetical or counterfactual situations, including “If I were you”.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, gender equality and non-discrimination, migration and belonging, digital rights and algorithmic bias, and youth civic engagement.",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, inferring meaning from context clues, identifying the main idea versus supporting details, and recognising the text type and the author’s purpose.",
            "EFL.5.4.d.16. Passive voice: present simple passive and past simple passive for informational and scientific register; modal passive (should be done, must be checked); and the causative have/get + object + past participle for services and life situations.",
            "EFL.5.3.d.33. Responsible and ethical use of AI and digital tools for language learning: citing AI assistance, comparing AI output with reliable human sources, avoiding plagiarism, and recognizing when AI-generated content may exclude or misrepresent local communities.",
          ],
          procedimentales: [
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, institutional affiliation, and stated purpose.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats (e.g., According to …, Source: …, [Author, Year]) and explain why the source is reliable.",
            "EFL.5.2.p.48. Use AI tools ethically as a language-learning aid: acknowledge AI assistance in schoolwork, compare AI-generated responses with reliable sources, and avoid submitting AI-generated text as one’s own.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, purpose, and evidence quality before using them in written or oral work.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information without adding opinion.",
            "EFL.5.2.p.38. Gloss key terms — technical, cultural, or discipline-specific words — in English or Spanish so that a reader unfamiliar with the field can follow the text.",
            "EFL.5.2.p.8. Explain causes and consequences of social, environmental, or technological issues using Type 1 and Type 2 conditionals, modals, and cause-result connectors.",
            "EFL.5.2.p.9. Sustain an opinion on a familiar topic with at least two reasons and a concrete example, acknowledging a counterargument and responding to it.",
            "EFL.5.3.p.17. Infer the meanings of unknown words and implied meanings from context clues, textual organization, and prior knowledge.",
            "EFL.5.3.p.18. Identify and evaluate the author’s purpose, point of view, and use of evidence in informational and argumentative texts.",
            "EFL.5.3.p.19. Begin to distinguish facts from opinions in news reports, opinion columns, and reviews, using signal language and hedging markers as guides.",
            "EFL.5.4.p.24. Write opinion columns with a clear thesis statement, two to three supporting reasons with examples, acknowledgment of a counterargument, and a conclusion that restates the thesis in new words.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues — climate change, gender equality, migration, digital rights — through English with a commitment to informed, respectful, and constructive participation.",
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts — literary, journalistic, scientific, multimodal — beyond those assigned in class.",
            "EFL.5.3.a.9. Show persistence in navigating unfamiliar texts by using context clues, inference, and available resources rather than immediately seeking a translation.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.14",
    descripcion: "Reading English-language news reports carefully, focusing on emotional perspectives expressed through quoted voices, to recognize the human impact behind reported events",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, and source credibility applied to journalistic articles, social media posts, and advertising; the distinction between information and opinion.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle, the magazine article, and the review — their purposes, audiences, and organisational patterns.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language (according to, it is reported that, in my view, I believe) and basic evaluative language.",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; and past continuous for background actions.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although), cause (because, since, as), result (therefore, as a result, so), addition (in addition, furthermore), and exemplification (for example, for instance, such as).",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, and identifying the main idea versus supporting details.",
            "EFL.5.2.d.18. Simple reported speech with say, ask, tell: statements with backshift and yes/no questions with if/whether.",
          ],
          procedimentales: [
            "EFL.5.3.p.19. Distinguish basic differences between facts and opinions in news reports, opinion columns, and reviews, using signal language as a guide.",
            "EFL.5.1.p.4. Identify a speaker’s attitude and opinion in interviews and discussions on familiar topics, using lexical and prosodic cues.",
            "EFL.5.2.p.12. Participate in interviews, asking follow-up questions, requesting clarification, and using active listening strategies.",
            "EFL.5.3.p.16. Read journalistic chronicles, magazine articles, and online blogs, identifying the main idea and supporting details.",
            "EFL.5.3.p.17. Infer the meanings of unknown words from context clues and prior knowledge.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues through English with a commitment to respectful participation.",
            "EFL.5.3.a.9. Show persistence in navigating unfamiliar texts by using context clues and available resources rather than immediately seeking a translation.",
            "EFL.5.3.a.5. Recognize cultural stereotypes and unfair representations in texts and media, and identify the harm they can cause to individuals.",
            "EFL.5.2.a.11. Demonstrate empathy toward peers who use English differently, supporting rather than correcting in ways that discourage participation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, bias, framing, and source credibility applied to journalistic articles, social media posts, advertising, and AI-generated content; the distinction between information, opinion, and misinformation.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle, the magazine article, the review, and the opinion column with a thesis structure — their purposes, audiences, organisational patterns, and typical language features.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language, hedging (might, may, could, seems to), and evaluative language (unfortunately, remarkably, clearly).",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple, present continuous, present perfect simple, past simple, past continuous, past perfect simple for events before a past reference point, and future with will, going to, and shall.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), and concession (even though, despite).",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, inferring meaning from context clues, identifying the main idea versus supporting details, and recognising the text type.",
            "EFL.5.2.d.18. Simple reported speech with say, ask, tell: statements with backshift; yes/no questions with if/whether; wh-questions; and commands with the infinitive.",
          ],
          procedimentales: [
            "EFL.5.1.p.4. Identify a speaker’s attitude, opinion, and degree of certainty in interviews, debates, and discussions, using lexical and prosodic cues.",
            "EFL.5.2.p.12. Conduct and respond to interviews, asking follow-up questions, requesting clarification, reformulating answers, and using active listening strategies.",
            "EFL.5.3.p.16. Read journalistic chronicles, magazine articles, and online blogs, identifying the main idea, supporting details, and the author’s purpose.",
            "EFL.5.3.p.17. Infer the meanings of unknown words and implied meanings from context clues, textual organization, and prior knowledge.",
            "EFL.5.3.p.19. Distinguish facts from opinions in news reports, opinion columns, and reviews, using signal language and hedging markers as guides.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues — climate change, gender equality, migration, and digital rights — through English with a commitment to informed and respectful participation.",
            "EFL.5.3.a.9. Show persistence in navigating unfamiliar texts by using context clues, inference, and available resources rather than immediately seeking a translation.",
            "EFL.5.3.a.5. Recognize and reject cultural stereotypes and unfair representations in texts and media, and identify the harm they can cause to communities and individuals.",
            "EFL.5.2.a.11. Demonstrate empathy toward peers and community members who use English differently, supporting rather than correcting in ways that discourage participation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, bias, framing, and source credibility applied to journalistic articles, social media posts, advertising, and AI-generated content; the distinction between information, opinion, and misinformation.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle (narrative-informational hybrid), the magazine article, the review (film, book, place, or event), the opinion column with a thesis structure, and the short literary excerpt — their purposes, audiences, organisational patterns, and typical language features.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language (according to, it is reported that, in my view, I believe), hedging (might, may, could, seems to), and evaluative language (unfortunately, remarkably, clearly).",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; past continuous for background actions; past perfect simple for events before a past reference point; future with will, going to, and shall; and was/were going to for unfulfilled intentions.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), concession (even though, despite, despite), and condition (if, unless, provided that).",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, inferring meaning from context clues, identifying the main idea versus supporting details, and recognising the text type and the author’s purpose.",
            "EFL.5.2.d.18. Simple reported speech with say, ask, tell: statements with backshift; yes/no questions with if/whether; wh-questions; commands with the infinitive; and indirect questions with know and wonder.",
          ],
          procedimentales: [
            "EFL.5.1.p.4. Identify a speaker’s attitude, opinion, and degree of certainty in interviews, debates, and discussions, using lexical and prosodic cues.",
            "EFL.5.2.p.12. Conduct and respond to interviews, asking follow-up questions, requesting clarification, reformulating answers, and using active listening strategies.",
            "EFL.5.3.p.16. Read journalistic chronicles, magazine articles, and online blogs, identifying the main idea, supporting details, and the author’s purpose and stance.",
            "EFL.5.3.p.17. Infer the meanings of unknown words and implied meanings from context clues, textual organization, and prior knowledge.",
            "EFL.5.3.p.19. Begin to distinguish facts from opinions in news reports, opinion columns, and reviews, using signal language and hedging markers as guides.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues — climate change, gender equality, migration, digital rights — through English with a commitment to informed, respectful, and constructive participation.",
            "EFL.5.3.a.9. Show persistence in navigating unfamiliar texts by using context clues, inference, and available resources rather than immediately seeking a translation.",
            "EFL.5.3.a.5. Recognize and reject cultural stereotypes and unfair representations in texts and media, and name the harm they can cause to communities and individuals.",
            "EFL.5.2.a.11. Demonstrate empathy toward peers and community members who use English differently, supporting rather than correcting in ways that discourage participation.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.15",
    descripcion: "Reading short stories by adolescents from different parts of the world interculturally, to identify themes, voices, narrative techniques, and contexts, and to recognize adolescence as a diverse and plural experience",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, and Vietnam — their histories with English and distinct voices.",
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle, the magazine article, and the review — their purposes, audiences, and organisational patterns.",
            "EFL.5.2.d.20. Comparatives and superlatives (regular and irregular) with degree modifiers: much/far/a lot + comparative and not as … as; intensifiers (very, quite, rather).",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; and past continuous for background actions.",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, and identifying the main idea versus supporting details.",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; and gerund as subject or object.",
          ],
          procedimentales: [
            "EFL.5.2.p.40. Mediate cultural concepts such as practices, values, or references specific to one culture, explaining their meaning to an audience unfamiliar with them.",
            "EFL.5.4.p.26. Produce short reviews of familiar films, books, places, or events using the description-opinion-recommendation structure and evaluative vocabulary.",
            "EFL.5.2.p.6. Describe experiences and memories using a range of tenses, basic discourse markers, and evaluative vocabulary.",
            "EFL.5.4.p.25. Write autobiographical narratives and biographical texts using first- or third-person narration, past tense, and chronological organization.",
            "EFL.5.3.p.22. Read short literary excerpts, identifying themes, narrative voice, and setting.",
            "EFL.5.3.p.21. Compare two short texts on the same topic, identifying shared ideas and differences in framing.",
            "EFL.5.4.p.43. Record and recycle new vocabulary using vocabulary notebooks and flashcard systems, organizing entries by topic and example sentences.",
          ],
          actitudinales: [
            "EFL.5.2.a.6. Value linguistic and cultural diversity as a resource for collective understanding.",
            "EFL.5.2.a.4. Show curiosity and openness toward the cultural practices of English-using communities.",
            "EFL.5.3.a.22. Show appreciation for the aesthetic and expressive possibilities of English as encountered in literature, music, and film.",
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts beyond those assigned in class.",
            "EFL.5.3.a.5. Recognize cultural stereotypes and unfair representations in texts and media, and identify the harm they can cause to individuals.",
            "EFL.5.3.a.10. Value reading as a way to encounter different lives and perspectives, and recognize literature as a way to understand one’s own experience and that of others.",
            "EFL.5.4.a.23. Value creative transformation of texts, such as alternative endings and changes of voice, as a meaningful form of authorship that connects reading and writing.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, Vietnam, India, Jamaica, Singapore, and Ireland — their histories with English and distinct voices.",
            "EFL.5.2.d.23. Vocabulary in the same semantic fields, with particular attention to collocations and dependent prepositions.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle, the magazine article, the review, and the opinion column with a thesis structure — their purposes, audiences, organisational patterns, and typical language features.",
            "EFL.5.2.d.20. Comparatives and superlatives (regular and irregular) with degree modifiers: much/far/a lot + comparative, not as … as, not … enough to, too … to; and intensifiers (very, quite, rather, extremely, fairly).",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple, present continuous, present perfect simple, past simple, past continuous, past perfect simple for events before a past reference point, and future with will, going to, and shall.",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, inferring meaning from context clues, identifying the main idea versus supporting details, and recognising the text type.",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; gerund as subject or object; phrasal verbs and verbs with prepositions.",
          ],
          procedimentales: [
            "EFL.5.2.p.40. Mediate cultural concepts across two cultural contexts, explaining their meaning and significance to an audience unfamiliar with them.",
            "EFL.5.4.p.26. Produce reviews of films, books, places, or events using the description-opinion-recommendation structure, evaluative vocabulary, and explicit criteria.",
            "EFL.5.2.p.6. Describe experiences, memories, dreams, and future ambitions using a range of tenses, discourse markers, and evaluative vocabulary.",
            "EFL.5.4.p.25. Write autobiographical narratives and biographical texts using first- or third-person narration, past tense, chronological organization, and evaluative reflection on events.",
            "EFL.5.3.p.22. Read short literary excerpts — stories, autobiographical fragments, song lyrics — and identify themes, narrative voice, setting, and the ways the author creates meaning.",
            "EFL.5.3.p.21. Synthesize information across two short texts on the same topic, identifying shared ideas, differences in framing, and points of complementarity.",
            "EFL.5.4.p.43. Record and recycle new vocabulary systematically using vocabulary notebooks, flashcard systems, and spaced repetition, organizing entries by topic, collocations, and example sentences.",
          ],
          actitudinales: [
            "EFL.5.2.a.6. Value linguistic and cultural diversity as a resource for collective understanding, and recognize plurilingualism as a continuous learning process.",
            "EFL.5.2.a.4. Show curiosity and openness toward the cultural practices, values, and perspectives of English-using communities.",
            "EFL.5.3.a.22. Show appreciation for the aesthetic and expressive possibilities of English — its rhythms, images, tones, and registers — as encountered in literature, music, film, and everyday language.",
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts — literary, journalistic, scientific, and multimodal — beyond those assigned in class.",
            "EFL.5.3.a.5. Recognize and reject cultural stereotypes and unfair representations in texts and media, and identify the harm they can cause to communities and individuals.",
            "EFL.5.3.a.10. Value the act of reading as a way to encounter different lives, perspectives, and questions, and recognize literature as a way to understand one’s own experience and that of others.",
            "EFL.5.4.a.23. Value creative transformation of texts — remixes, alternative endings, and changes of voice — as a legitimate and meaningful form of authorship that connects reading and writing.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.28. Cultural diversity of English-using communities: language and cultural practices in the Philippines, Kenya, Tanzania, Aotearoa/New Zealand, Vietnam, India, Jamaica, Singapore, and Ireland — their histories with English, distinct voices, and contributions to global culture and knowledge.",
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather — with particular attention to collocations, dependent prepositions, and register variation within each field.",
            "EFL.5.3.d.7. Journalistic and literary genres: the chronicle (narrative-informational hybrid), the magazine article, the review (film, book, place, or event), the opinion column with a thesis structure, and the short literary excerpt — their purposes, audiences, organisational patterns, and typical language features.",
            "EFL.5.2.d.20. Comparatives and superlatives (regular and irregular) with degree modifiers: much/far/a lot + comparative, not as … as, not … enough to, too … to; intensifiers (very, quite, rather, extremely, fairly); and compound adjectives.",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; past continuous for background actions; past perfect simple for events before a past reference point; future with will, going to, and shall; and was/were going to for unfulfilled intentions.",
            "EFL.5.3.d.10. Reading strategies for extended texts: skimming for the gist, scanning for specific information, activating prior knowledge and making predictions, inferring meaning from context clues, identifying the main idea versus supporting details, and recognising the text type and the author’s purpose.",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; gerund as subject or object; phrasal verbs and verbs with prepositions; and verb + object + infinitive patterns (give/take/send + direct/indirect object).",
          ],
          procedimentales: [
            "EFL.5.2.p.40. Mediate cultural concepts — practices, values, or references specific to one culture — across two cultural contexts, explaining their meaning and significance to an audience unfamiliar with them.",
            "EFL.5.4.p.26. Produce reviews of films, books, places, or events using the description-opinion-recommendation structure, evaluative vocabulary, and explicit criteria.",
            "EFL.5.2.p.6. Describe experiences, memories, dreams, and future ambitions using a range of tenses, discourse markers, and evaluative vocabulary.",
            "EFL.5.4.p.25. Write autobiographical narratives and biographical texts using first- or third-person narration, past tense, chronological organization, and evaluative reflection on events.",
            "EFL.5.3.p.22. Read short literary excerpts — stories, autobiographical fragments, song lyrics — and identify themes, narrative voice, setting, and the ways the author creates meaning.",
            "EFL.5.3.p.21. Synthesize information across two short texts on the same topic, identifying shared ideas, differences in framing, and points of complementarity.",
            "EFL.5.4.p.43. Record and recycle new vocabulary systematically using vocabulary notebooks, flashcard systems, and spaced repetition, organizing entries by topic, collocations, and example sentences.",
          ],
          actitudinales: [
            "EFL.5.2.a.6. Value linguistic and cultural diversity as a resource for collective understanding, and recognize plurilingualism as a continuous learning process rather than a destination.",
            "EFL.5.2.a.4. Show curiosity and openness toward the cultural practices, values, and perspectives of English-using communities.",
            "EFL.5.3.a.22. Show appreciation for the aesthetic and expressive possibilities of English — its rhythms, images, tones, and registers — as encountered in literature, music, film, and everyday language.",
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts — literary, journalistic, scientific, multimodal — beyond those assigned in class.",
            "EFL.5.3.a.5. Recognize and reject cultural stereotypes and unfair representations in texts and media, and name the harm they can cause to communities and individuals.",
            "EFL.5.3.a.10. Value the act of reading as a way to encounter different lives, perspectives, and questions, and recognize literature as both a mirror and a window for understanding one’s own experience and that of others.",
            "EFL.5.4.a.23. Value creative transformation of texts — remixes, alternative endings, changes of voice — as a legitimate and meaningful form of authorship that connects reading and writing.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.16",
    descripcion: "Engaging creatively with literature by transforming short stories into alternative versions, including rewritings, new endings, and shifts in narrative perspective, with peer review",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1, and the distinction between accuracy and fluency.",
            "EFL.5.2.d.35. Contrastive linguistics of English: typological differences in word order, articles, and null subject, and false friends.",
            "EFL.5.2.d.17. Universal truths; Type 1 (If + present simple + will) for real future possibilities; Type 2 (If + past simple + would) for hypothetical or counterfactual situations, including “If I were you”. Conditional sentences: Type 0 for scientific and universal truths and Type 1 (If + present simple + will) for real future possibilities.",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; and gerund as subject or object.",
            "EFL.5.4.d.38. Language-learning strategies: planning and goal-setting for a learning task; monitoring comprehension and production using checklists; and self-correcting with grammar and vocabulary references.",
          ],
          procedimentales: [
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists and self-assessment rubrics.",
            "EFL.5.4.p.50. Respect intellectual property in school products by crediting images, texts, sounds, and ideas borrowed from others using simple attribution formats.",
            "EFL.5.4.p.26. Produce short reviews of familiar films, books, places, or events using the description-opinion-recommendation structure and evaluative vocabulary.",
            "EFL.5.3.p.22. Read short literary excerpts, identifying themes, narrative voice, and setting.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, and help peers express their ideas.",
            "EFL.5.4.p.32. Revise one’s own drafts using criteria for content, organization, language accuracy, and audience awareness, with guidance.",
            "EFL.5.4.p.33. Rewrite drafts to improve cohesion and grammatical accuracy, making corrections to verb tenses, connectors, and vocabulary.",
            "EFL.5.4.p.44. Reflect on language errors and identify recurring patterns in one’s production.",
          ],
          actitudinales: [
            "EFL.5.4.a.16. Show commitment to improvement in language production, using feedback from peers and teachers as a resource for growth.",
            "EFL.5.4.a.18. Recognize that language errors are a natural part of learning and show willingness to improve after correction.",
            "EFL.5.4.a.17. Value self-assessment as a useful tool for learning and engage with it honestly.",
            "EFL.5.3.a.10. Value reading as a way to encounter different lives and perspectives, and recognize literature as a way to understand one’s own experience and that of others.",
            "EFL.5.4.a.23. Value creative transformation of texts, such as alternative endings and changes of voice, as a meaningful form of authorship that connects reading and writing.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing and revision processes, treating peers’ texts with respect and offering constructive feedback.",
            "EFL.5.4.a.14. Recognize the importance of revisiting and revising understanding after miscommunication in collaborative learning.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
            "EFL.5.2.d.35. Contrastive linguistics of English: typological differences (word order, articles, null subject, periphrastic verbs), false friends, calques, and syntactic transfer errors.",
            "EFL.5.2.d.17. Conditional sentences: Type 0 for scientific and universal truths; Type 1 (If + present simple + will) for real future possibilities; and Type 2 (If + past simple + would) for hypothetical situations.",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; gerund as subject or object; phrasal verbs and verbs with prepositions.",
            "EFL.5.4.d.38. Language-learning strategies: planning and goal-setting for a learning task; monitoring comprehension and production using checklists; self-correcting with grammar and vocabulary references; recording and recycling vocabulary through notebooks and flashcards; and reflecting on error patterns.",
          ],
          procedimentales: [
            "EFL.5.4.p.26. Produce reviews of films, books, places, or events using the description-opinion-recommendation structure, evaluative vocabulary, and explicit criteria.",
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists, self-assessment rubrics, and peer feedback, and adjust strategies as needed.",
            "EFL.5.4.p.50. Respect intellectual property in school products by crediting borrowed images, texts, sounds, and ideas using simple attribution formats and basic license information.",
            "EFL.5.3.p.22. Read short literary excerpts — stories, autobiographical fragments, song lyrics — and identify themes, narrative voice, setting, and the ways the author creates meaning.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, give and receive constructive feedback, and help peers express their ideas.",
            "EFL.5.4.p.32. Revise one’s own and peers’ drafts using a rubric that covers content, organization, language range, accuracy, and audience awareness, and provide constructive written feedback.",
            "EFL.5.4.p.33. Rewrite drafts to improve cohesion and grammatical accuracy, making targeted corrections to verb tenses, connectors, article use, and vocabulary range.",
            "EFL.5.4.p.44. Reflect on language errors, identify patterns, and set specific improvement goals for the next task.",
          ],
          actitudinales: [
            "EFL.5.4.a.16. Show commitment to accuracy and improvement in language production, using feedback from rubrics, peers, and teachers as a resource for growth.",
            "EFL.5.4.a.18. Recognize that language errors are a natural and necessary part of learning, and develop resilience in response to difficulty or correction.",
            "EFL.5.4.a.17. Value self-assessment and peer assessment as useful tools for learning, engaging with them honestly and constructively.",
            "EFL.5.3.a.10. Value the act of reading as a way to encounter different lives, perspectives, and questions, and recognize literature as a way to understand one’s own experience and that of others.",
            "EFL.5.4.a.23. Value creative transformation of texts — remixes, alternative endings, and changes of voice — as a legitimate and meaningful form of authorship that connects reading and writing.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing, editing, and revision processes, treating peers’ texts with respect and offering feedback that is specific and constructive.",
            "EFL.5.4.a.14. Recognize the importance of second chances and repair in collaborative learning, showing willingness to revisit, revise, and rebuild understanding after miscommunication or disagreement.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
            "EFL.5.2.d.35. Contrastive linguistics of English: typological differences (word order, articles, null subject, periphrastic verbs), false friends, calques, syntactic transfer errors, and how awareness of these supports accuracy.",
            "EFL.5.2.d.17. Conditional sentences: Type 0 for scientific and universal truths; Type 1 (If + present simple + will) for real future possibilities; Type 2 (If + past simple + would) for hypothetical or counterfactual situations, including “If I were you”.",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; gerund as subject or object; phrasal verbs and verbs with prepositions; and verb + object + infinitive patterns (give/take/send + direct/indirect object).",
            "EFL.5.4.d.38. Language-learning strategies: planning and goal-setting for a learning task; monitoring comprehension and production using checklists; self-correcting with grammar and vocabulary references; recording and recycling vocabulary through notebooks, flashcards, and spaced repetition; and reflecting on error patterns to set improvement goals.",
          ],
          procedimentales: [
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists, self-assessment rubrics, and peer feedback, and adjust strategies as needed.",
            "EFL.5.4.p.50. Respect intellectual property in school products: credit images, texts, sounds, and ideas borrowed from others using simple attribution formats and basic license information.",
            "EFL.5.4.p.26. Produce reviews of films, books, places, or events using the description-opinion-recommendation structure, evaluative vocabulary, and explicit criteria.",
            "EFL.5.3.p.22. Read short literary excerpts — stories, autobiographical fragments, song lyrics — and identify themes, narrative voice, setting, and the ways the author creates meaning.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, give and receive constructive feedback, and help peers express their ideas.",
            "EFL.5.4.p.32. Revise one’s own and peers’ drafts using a rubric that covers content, organization, language range, accuracy, and audience awareness, and provide constructive written feedback.",
            "EFL.5.4.p.33. Rewrite the draft to improve cohesion and grammatical accuracy, making targeted corrections to verb tenses, connectors, article use, and vocabulary range.",
            "EFL.5.4.p.44. Reflect on language errors, identify patterns (e.g., consistent tense confusion, missing articles, calques from Spanish), and set specific improvement goals for the next task.",
          ],
          actitudinales: [
            "EFL.5.3.a.10. Value the act of reading as a way to encounter different lives, perspectives, and questions, and recognize literature as both a mirror and a window for understanding one’s own experience and that of others.",
            "EFL.5.4.a.16. Show commitment to accuracy and improvement in language production, using feedback from rubrics, peers, and teachers as a resource for growth rather than a judgment.",
            "EFL.5.4.a.18. Recognize that language errors are a natural and necessary part of learning, and develop resilience and a growth mindset in response to difficulty or correction.",
            "EFL.5.4.a.17. Value self-assessment and peer assessment as fair and useful tools for learning, engaging with them honestly and constructively.",
            "EFL.5.4.a.23. Value creative transformation of texts — remixes, alternative endings, changes of voice — as a legitimate and meaningful form of authorship that connects reading and writing.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing, editing, and revision processes, treating peers’ texts with respect and offering feedback that is specific, constructive, and kind.",
            "EFL.5.4.a.14. Recognize the importance of second chances and repair in collaborative learning: willingness to revisit, revise, and rebuild understanding after miscommunication or disagreement.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.17",
    descripcion: "Developing intercultural awareness through guided research into school life in different countries, using English-language sources, to recognize diversity in educational systems and experiences",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.29. Intercultural awareness in communication: politeness norms and register expectations.",
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, date of publication, stated purpose, and evidence quality — applicable to print and digital texts.",
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year) and signal phrases for reported information.",
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience and paraphrasing to simplify or clarify.",
            "EFL.5.2.d.20. Comparatives and superlatives (regular and irregular) with degree modifiers: much/far/a lot + comparative and not as … as; intensifiers (very, quite, rather).",
            "EFL.5.2.d.18. Simple reported speech with say, ask, tell: statements with backshift and yes/no questions with if/whether.",
          ],
          procedimentales: [
            "EFL.5.2.p.40. Mediate cultural concepts such as practices, values, or references specific to one culture, explaining their meaning to an audience unfamiliar with them.",
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements to confirm understanding.",
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on familiar academic, cultural, and community topics, taking notes using keywords and phrases.",
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, and stated purpose.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps with guidance.",
            "EFL.5.2.p.48. Use AI tools as a language-learning aid, acknowledging AI assistance in schoolwork and comparing AI-generated responses with reliable sources.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, and purpose before using them in written or oral work.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information.",
            "EFL.5.2.p.37. Paraphrase an English statement or passage into simpler English or Spanish to clarify its meaning for a peer.",
            "EFL.5.2.p.38. Gloss key terms in English or Spanish so that a reader unfamiliar with the field can follow the text.",
            "EFL.5.3.p.21. Compare two short texts on the same topic, identifying shared ideas and differences in framing.",
            "EFL.5.4.p.43. Record and recycle new vocabulary using vocabulary notebooks and flashcard systems, organizing entries by topic and example sentences.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, and seeking help when needed.",
            "EFL.5.2.a.12. Value mediation through summarizing, paraphrasing, glossing, and explaining as a meaningful communicative act that bridges languages.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.29. Intercultural awareness in communication: politeness norms, register expectations, taboo or sensitive topics, and the cultural specificity of humour and indirectness.",
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, institutional affiliation, date of publication, stated purpose, evidence quality, and potential bias — applicable to print and digital texts.",
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year), signal phrases for reported information, and the distinction between summary and paraphrase.",
            "EFL.5.2.d.23. Vocabulary in the same semantic fields, with particular attention to collocations and dependent prepositions.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience; paraphrasing to simplify or clarify; glossing key terms; and explaining culturally specific concepts.",
            "EFL.5.2.d.20. Comparatives and superlatives (regular and irregular) with degree modifiers: much/far/a lot + comparative, not as … as, not … enough to, too … to; and intensifiers (very, quite, rather, extremely, fairly).",
            "EFL.5.2.d.18. Simple reported speech with say, ask, tell: statements with backshift; yes/no questions with if/whether; wh-questions; and commands with the infinitive.",
          ],
          procedimentales: [
            "EFL.5.2.p.40. Mediate cultural concepts across two cultural contexts, explaining their meaning and significance to an audience unfamiliar with them.",
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements and paraphrase what others have said to confirm understanding.",
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on academic, cultural, and community topics, taking notes using keywords and phrases with increasing independence.",
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, institutional affiliation, and stated purpose.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats and explain why the source is reliable.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps and a time frame.",
            "EFL.5.2.p.48. Use AI tools ethically as a language-learning aid, acknowledging AI assistance in schoolwork, comparing AI-generated responses with reliable sources, and avoiding submitting AI-generated text as one’s own.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, purpose, and evidence quality before using them in written or oral work.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information without adding opinion with increasing independence.",
            "EFL.5.2.p.37. Paraphrase a complex English statement or passage into simpler English or Spanish to clarify its meaning for a peer or community member.",
            "EFL.5.2.p.38. Gloss technical, cultural, or discipline-specific key terms in English or Spanish so that a reader unfamiliar with the field can follow the text.",
            "EFL.5.3.p.21. Synthesize information across two short texts on the same topic, identifying shared ideas, differences in framing, and points of complementarity.",
            "EFL.5.4.p.43. Record and recycle new vocabulary systematically using vocabulary notebooks, flashcard systems, and spaced repetition, organizing entries by topic, collocations, and example sentences.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, reflecting on progress, and seeking help when needed.",
            "EFL.5.2.a.12. Value mediation through summarizing, paraphrasing, glossing, and explaining as a meaningful communicative act that bridges languages and cultures.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, institutional affiliation, date of publication, stated purpose, evidence quality, and potential bias — applicable to print and digital texts, including AI-generated content.",
            "EFL.5.2.d.29. Intercultural awareness in communication: politeness norms, register expectations, taboo or sensitive topics, and the cultural specificity of humour, indirectness, and non-verbal behaviour.",
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, institutional affiliation, date of publication, stated purpose, evidence quality, and potential bias — applicable to print and digital texts, including AI-generated content.",
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year), signal phrases for reported information, and the distinction between summary, paraphrase, and quotation.",
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather — with particular attention to collocations, dependent prepositions, and register variation within each field.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience; paraphrasing to simplify or clarify; glossing key terms; and explaining culturally specific concepts.",
            "EFL.5.2.d.20. Comparatives and superlatives (regular and irregular) with degree modifiers: much/far/a lot + comparative, not as … as, not … enough to, too … to; intensifiers (very, quite, rather, extremely, fairly); and compound adjectives.",
            "EFL.5.2.d.18. Simple reported speech with say, ask, tell: statements with backshift; yes/no questions with if/whether; wh-questions; commands with the infinitive; and indirect questions with know and wonder.",
          ],
          procedimentales: [
            "EFL.5.2.p.40. Mediate cultural concepts — practices, values, or references specific to one culture — across two cultural contexts, explaining their meaning and significance to an audience unfamiliar with them.",
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements and paraphrase what others have said to confirm understanding.",
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on academic, cultural, and community topics, taking notes using keywords and phrases.",
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, institutional affiliation, and stated purpose.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats (e.g., According to …, Source: …, [Author, Year]) and explain why the source is reliable.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps and a time frame.",
            "EFL.5.2.p.48. Use AI tools ethically as a language-learning aid: acknowledge AI assistance in schoolwork, compare AI-generated responses with reliable sources, and avoid submitting AI-generated text as one’s own.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, purpose, and evidence quality before using them in written or oral work.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information without adding opinion.",
            "EFL.5.2.p.38. Gloss key terms — technical, cultural, or discipline-specific words — in English or Spanish so that a reader unfamiliar with the field can follow the text.",
            "EFL.5.3.p.21. Synthesize information across two short texts on the same topic, identifying shared ideas, differences in framing, and points of complementarity.",
            "EFL.5.4.p.43. Record and recycle new vocabulary systematically using vocabulary notebooks, flashcard systems, and spaced repetition, organizing entries by topic, collocations, and example sentences.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, reflecting honestly on progress, and proactively seeking help when needed.",
            "EFL.5.2.a.12. Value mediation — summarizing, paraphrasing, glossing, explaining — is a meaningful communicative act that bridges languages, cultures, and knowledge systems.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.18",
    descripcion: "Collective creation of anti-discrimination campaigns through posters, digital publications, and awareness messages to promote non-discrimination within school and community contexts",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1, and the distinction between accuracy and fluency.",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could (ability, polite request, permission), should/ought to (advice, expectation), must/mustn’t (obligation, prohibition), and have (got) to (external obligation).",
            "EFL.5.2.d.34. Global issues: climate change and environmental responsibility, and gender equality and non-discrimination. (Ref. EFL.5.d.30.) Environmental and community responsibility expressed in English: vocabulary for describing environmental actions and concepts of the rights of nature.",
          ],
          procedimentales: [
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose and audience, using appropriate openings, main content, requests, and closings.",
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists and self-assessment rubrics.",
            "EFL.5.4.p.34. Integrate visuals and text in multimodal products such as posters and digital publications so that they contribute to the overall message.",
            "EFL.5.2.p.8. Explain causes and consequences of familiar social, environmental, or technological issues using Type 1 conditionals, modals, and cause-result connectors.",
            "EFL.5.4.p.52. Produce school products responsibly, asking for permission before including another person’s image, voice, or work.",
            "EFL.5.2.p.47. Use English to participate in local cause-driven projects, contributing short written and spoken texts to shared community purposes.",
            "EFL.5.2.p.13. Negotiate simple plans and services, expressing preferences and suggesting alternatives using modal verbs.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, and help peers express their ideas.",
            "EFL.5.4.p.32. Revise one’s own drafts using criteria for content, organization, language accuracy, and audience awareness, with guidance.",
            "EFL.5.4.p.44. Reflect on language errors and identify recurring patterns in one’s production.",
            "EFL.5.4.p.35. Write short public service announcements and awareness messages using a clear structure, direct address, and imperative constructions.",
            "EFL.5.2.p.46. Communicate ideas about environmental responsibility and sustainable practices in English, using vocabulary for environmental topics.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues through English with a commitment to respectful participation.",
            "EFL.5.4.a.18. Recognize that language errors are a natural part of learning and show willingness to improve after correction.",
            "EFL.5.4.a.17. Value self-assessment as a useful tool for learning and engage with it honestly.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices to participate.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing and revision processes, treating peers’ texts with respect and offering constructive feedback.",
            "EFL.5.4.a.14. Recognize the importance of revisiting and revising understanding after miscommunication in collaborative learning.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability.",
            "EFL.5.2.a.21. Demonstrate responsibility toward the school community by using English skills in service of collective well-being through awareness messages.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could, will/would, shall, should/ought to, may/might, must/mustn’t, have (got) to, and need/needn’t.",
            "EFL.5.2.d.34. Global issues: climate change and environmental responsibility, gender equality and non-discrimination, migration and belonging, and digital rights and algorithmic bias. (Ref. EFL.5.d.30.) Environmental and community responsibility expressed in English: vocabulary for describing environmental actions; concepts of the rights of nature and Sumak Kawsay; and participation in cause-driven school projects.",
          ],
          procedimentales: [
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists, self-assessment rubrics, and peer feedback, and adjust strategies as needed.",
            "EFL.5.4.p.34. Integrate visuals and text in multimodal products, including photo-essays and illustrated anthologies, so that each mode contributes meaningfully to the overall message.",
            "EFL.5.2.p.8. Explain causes and consequences of social, environmental, or technological issues using Type 1 and Type 2 conditionals, modals, and cause-result connectors.",
            "EFL.5.4.p.52. Write, record, or publish school products responsibly, asking for permission before including another person’s image, voice, or work and recognizing the importance of ethical representation.",
            "EFL.5.2.p.47. Use English to participate in local and global cause-driven projects, contributing written and spoken texts to shared community purposes.",
            "EFL.5.2.p.13. Negotiate plans and services, expressing preferences, suggesting alternatives, and reaching agreements using modal verbs and conditional structures.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, give and receive constructive feedback, and help peers express their ideas.",
            "EFL.5.4.p.32. Revise one’s own and peers’ drafts using a rubric that covers content, organization, language range, accuracy, and audience awareness, and provide constructive written feedback.",
            "EFL.5.4.p.44. Reflect on language errors, identify patterns, and set specific improvement goals for the next task.",
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose, audience, and register, using appropriate openings, main content, requests or calls to action, and closings.",
            "EFL.5.4.p.35. Write short public service announcements and awareness messages using a clear structure (hook, information, call to action), direct address, and imperative or modal constructions.",
            "EFL.5.2.p.46. Communicate ideas about environmental responsibility, sustainable practices, and community actions in English, using vocabulary for environmental topics and the rights of nature.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues — climate change, gender equality, migration, and digital rights — through English with a commitment to informed and respectful participation.",
            "EFL.5.4.a.18. Recognize that language errors are a natural and necessary part of learning, and develop resilience in response to difficulty or correction.",
            "EFL.5.4.a.17. Value self-assessment and peer assessment as useful tools for learning, engaging with them honestly and constructively.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices and creating space for everyone to participate.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing, editing, and revision processes, treating peers’ texts with respect and offering feedback that is specific and constructive.",
            "EFL.5.4.a.14. Recognize the importance of second chances and repair in collaborative learning, showing willingness to revisit, revise, and rebuild understanding after miscommunication or disagreement.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability, the rights of nature, and environmental actions in the community.",
            "EFL.5.2.a.21. Demonstrate responsibility toward the school community by using English skills in service of collective well-being through campaigns, awareness messages, and shared documentation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could (ability, polite request, permission), will/would (future, polite request, deduction), shall (offer, suggestion), should/ought to (advice, expectation), may/might (possibility), must/mustn’t (obligation, prohibition), have (got) to (external obligation), need/needn’t (necessity, lack of necessity), and used to + infinitive (past habits). EFL.5.d.30. Global issues: climate change and environmental responsibility, gender equality and non-discrimination, migration and belonging, digital rights and algorithmic bias, and youth civic engagement.",
            "EFL.5.2.d.34. Environmental and community responsibility expressed in English: vocabulary for describing environmental actions; concepts of the rights of nature and Sumak Kawsay; and participation in cause-driven school and community projects.",
          ],
          procedimentales: [
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists, self-assessment rubrics, and peer feedback, and adjust strategies as needed.",
            "EFL.5.4.p.34. Integrate visuals and text in multimodal products (posters, digital publications, photo-essays, illustrated anthologies) so that each mode contributes meaningfully to the overall message.",
            "EFL.5.2.p.8. Explain causes and consequences of social, environmental, or technological issues using Type 1 and Type 2 conditionals, modals, and cause-result connectors.",
            "EFL.5.4.p.52. Write, record, or publish school products responsibly, asking for permission before including another person’s image, voice, or work and recognizing the importance of ethical representation.",
            "EFL.5.2.p.47. Use English to participate in local and global cause-driven projects — anti-discrimination campaigns, environmental initiatives, heritage documentation — contributing written and spoken texts to shared community purposes.",
            "EFL.5.2.p.47. Use English to participate in local and global cause-driven projects — anti-discrimination campaigns, environmental initiatives, heritage documentation — contributing written and spoken texts to shared community purposes.",
            "EFL.5.2.p.13. Negotiate plans and services, expressing preferences, suggesting alternatives, and reaching agreements using modal verbs and conditional structures.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, give and receive constructive feedback, and help peers express their ideas.",
            "EFL.5.4.p.32. Revise one’s own and peers’ drafts using a rubric that covers content, organization, language range, accuracy, and audience awareness, and provide constructive written feedback.",
            "EFL.5.4.p.44. Reflect on language errors, identify patterns (e.g., consistent tense confusion, missing articles, calques from Spanish), and set specific improvement goals for the next task.",
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose, audience, and register — openings, main content, requests or calls to action, and appropriate closings.",
            "EFL.5.4.p.35. Write short public service announcements and awareness messages using clear structure (hook, information, call to action), direct address, and imperative or modal constructions.",
            "EFL.5.2.p.46. Communicate ideas about environmental responsibility, sustainable practices, and community actions in English, using vocabulary for environmental topics and the rights of nature.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues — climate change, gender equality, migration, digital rights — through English with a commitment to informed, respectful, and constructive participation.",
            "EFL.5.4.a.18. Recognize that language errors are a natural and necessary part of learning, and develop resilience and a growth mindset in response to difficulty or correction.",
            "EFL.5.4.a.17. Value self-assessment and peer assessment as fair and useful tools for learning, engaging with them honestly and constructively.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices and creating space for everyone to participate.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing, editing, and revision processes, treating peers’ texts with respect and offering feedback that is specific, constructive, and kind.",
            "EFL.5.4.a.14. Recognize the importance of second chances and repair in collaborative learning: willingness to revisit, revise, and rebuild understanding after miscommunication or disagreement.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability, the rights of nature, and community-based environmental actions.",
            "EFL.5.2.a.21. Demonstrate a sense of responsibility toward the school community by using English skills in service of collective well-being — through campaigns, awareness messages, and shared documentation.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.19",
    descripcion: "Developing collaborative documentation skills by taking meeting notes and recording participants, topics, agreements, and pending tasks to support accountability in collective decision-making",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.1. Registers in spoken English — formal and informal — and the vocabulary and formulas that distinguish them across face-to-face interactions.",
            "EFL.5.2.d.2. Turn-taking strategies in debates and group discussions: yielding and claiming the floor, and signalling that one has finished speaking.",
            "EFL.5.2.d.18. Simple reported speech with say, ask, tell: statements with backshift and yes/no questions with if/whether.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, and the biographical text — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.1.p.4. Identify a speaker’s attitude and opinion in interviews and discussions on familiar topics, using lexical and prosodic cues.",
            "EFL.5.2.p.10. Open, maintain, and close conversations in semi-formal contexts such as introductions, service encounters, and school meetings, using appropriate formulas and register.",
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements to confirm understanding.",
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on familiar academic, cultural, and community topics, taking notes using keywords and phrases.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information.",
            "EFL.5.2.p.15. Use turn-taking signals in group discussions, including holding the floor, yielding, and politely interrupting.",
            "EFL.5.2.p.13. Negotiate simple plans and services, expressing preferences and suggesting alternatives using modal verbs.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, and help peers express their ideas.",
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose and audience, using appropriate openings, main content, requests, and closings.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, and seeking help when needed.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices to participate.",
            "EFL.5.2.a.11. Demonstrate empathy toward peers who use English differently, supporting rather than correcting in ways that discourage participation.",
            "EFL.5.2.a.21. Demonstrate responsibility toward the school community by using English skills in service of collective well-being through awareness messages.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.2. Turn-taking strategies in debates and group discussions: yielding, holding, and claiming the floor; backchanneling; and managing interruptions politely.",
            "EFL.5.1.d.1. Registers in spoken English — formal, semi-formal, and informal — and the vocabulary, intonation, and formulas that distinguish them across face-to-face and phone interactions.",
            "EFL.5.2.d.18. Simple reported speech with say, ask, tell: statements with backshift; yes/no questions with if/whether; wh-questions; and commands with the infinitive.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, and the public service announcement — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose, audience, and register, using appropriate openings, main content, requests or calls to action, and closings.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, give and receive constructive feedback, and help peers express their ideas.",
            "EFL.5.2.p.13. Negotiate plans and services, expressing preferences, suggesting alternatives, and reaching agreements using modal verbs and conditional structures.",
            "EFL.5.1.p.4. Identify a speaker’s attitude, opinion, and degree of certainty in interviews, debates, and discussions, using lexical and prosodic cues.",
            "EFL.5.2.p.10. Open, maintain, and close conversations in semi-formal contexts, including school and community meetings, using appropriate formulas and register with increasing independence.",
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements and paraphrase what others have said to confirm understanding.",
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on academic, cultural, and community topics, taking notes using keywords and phrases with increasing independence.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information without adding opinion with increasing independence.",
            "EFL.5.2.p.15. Use turn-taking signals effectively, including backchanneling, holding the floor, yielding, politely interrupting, and managing overlapping speech in group discussions.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, reflecting on progress, and seeking help when needed.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices and creating space for everyone to participate.",
            "EFL.5.2.a.11. Demonstrate empathy toward peers and community members who use English differently, supporting rather than correcting in ways that discourage participation.",
            "EFL.5.2.a.21. Demonstrate responsibility toward the school community by using English skills in service of collective well-being through campaigns, awareness messages, and shared documentation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.1. Registers in spoken English — formal, semi-formal, and informal — and the vocabulary, intonation, and formulas that distinguish them across face-to-face, phone, and digital interactions.",
            "EFL.5.2.d.2. Turn-taking strategies in debates and group discussions: yielding, holding, and claiming the floor; backchanneling; managing interruptions politely; and signalling that one has finished speaking.",
            "EFL.5.2.d.18. Simple reported speech with say, ask, tell: statements with backshift; yes/no questions with if/whether; wh-questions; commands with the infinitive; and indirect questions with know and wonder.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, the public service announcement, and meeting notes — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.1.p.4. Identify a speaker’s attitude, opinion, and degree of certainty in interviews, debates, and discussions, using lexical and prosodic cues.",
            "EFL.5.2.p.10. Open, maintain, and close conversations in semi-formal contexts — introductions, service encounters, school or community meetings — using appropriate formulas and register.",
            "EFL.5.2.p.14. Clarify and reformulate one’s own statements and paraphrase what others have said to confirm understanding.",
            "EFL.5.1.p.1. Identify the main idea and specific information in extended monologues, lectures, and talks on academic, cultural, and community topics, taking notes using keywords and phrases.",
            "EFL.5.2.p.36. Summarize the main ideas of an English-language text in Spanish (or vice versa) for a specific non-English-speaking audience, preserving the key information without adding opinion.",
            "EFL.5.2.p.15. Use turn-taking signals effectively: backchanneling, holding the floor, yielding, politely interrupting, and managing overlapping speech in group discussions.",
            "EFL.5.2.p.13. Negotiate plans and services, expressing preferences, suggesting alternatives, and reaching agreements using modal verbs and conditional structures.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, give and receive constructive feedback, and help peers express their ideas.",
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose, audience, and register — openings, main content, requests or calls to action, and appropriate closings.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, reflecting honestly on progress, and proactively seeking help when needed.",
            "EFL.5.2.a.3. Value the contributions of all group members regardless of English proficiency level, encouraging quieter voices and creating space for everyone to participate.",
            "EFL.5.2.a.11. Demonstrate empathy toward peers and community members who use English differently, supporting rather than correcting in ways that discourage participation.",
            "EFL.5.2.a.21. Demonstrate a sense of responsibility toward the school community by using English skills in service of collective well-being — through campaigns, awareness messages, and shared documentation.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.20",
    descripcion: "Producing informative articles on community projects, structured into introduction, development, participant voices, and conclusion, to share local initiatives with wider audiences and value community knowledge",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, and community traditions.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1, and the distinction between accuracy and fluency.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1, and the distinction between accuracy and fluency.",
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, date of publication, stated purpose, and evidence quality — applicable to print and digital texts.",
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year) and signal phrases for reported information.",
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, and source credibility applied to journalistic articles, social media posts, and advertising; the distinction between information and opinion.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience and paraphrasing to simplify or clarify.",
            "EFL.5.2.d.34. Environmental and community responsibility expressed in English: vocabulary for describing environmental actions and concepts of the rights of nature.",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although), cause (because, since, as), result (therefore, as a result, so), addition (in addition, furthermore), and exemplification (for example, for instance, such as).",
            "EFL.5.4.d.16. Passive voice: present simple passive and past simple passive for informational and scientific register.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, and the biographical text — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and organising information into an introduction, main points, and a conclusion with guidance.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, and stated purpose.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, and purpose before using them in written or oral work.",
            "EFL.5.4.p.50. Respect intellectual property in school products by crediting images, texts, sounds, and ideas borrowed from others using simple attribution formats.",
            "EFL.5.2.p.37. Paraphrase an English statement or passage into simpler English or Spanish to clarify its meaning for a peer.",
            "EFL.5.2.p.12. Participate in interviews, asking follow-up questions, requesting clarification, and using active listening strategies.",
            "EFL.5.2.p.47. Use English to participate in local cause-driven projects, contributing short written and spoken texts to shared community purposes.",
            "EFL.5.4.p.23. Compose short journalistic chronicles that integrate narrative and informational elements, including scene-setting, a narrative voice, and sources.",
            "EFL.5.4.p.32. Revise one’s own drafts using criteria for content, organization, language accuracy, and audience awareness, with guidance.",
            "EFL.5.4.p.33. Rewrite drafts to improve cohesion and grammatical accuracy, making corrections to verb tenses, connectors, and vocabulary.",
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose and audience, using appropriate openings, main content, requests, and closings.",
            "EFL.5.2.p.46. Communicate ideas about environmental responsibility and sustainable practices in English, using vocabulary for environmental topics.",
            "EFL.5.4.p.28. Write short structured reports with clearly labelled sections for objective, procedure, results, and conclusion.",
          ],
          actitudinales: [
            "EFL.5.2.a.12. Value mediation through summarizing, paraphrasing, glossing, and explaining as a meaningful communicative act that bridges languages.",
            "EFL.5.4.a.17. Value self-assessment as a useful tool for learning and engage with it honestly.",
            "EFL.5.2.a.20. Value local knowledge and community practices as sources of insight and wisdom worth sharing in English.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing and revision processes, treating peers’ texts with respect and offering constructive feedback.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability.",
            "EFL.5.2.a.21. Demonstrate responsibility toward the school community by using English skills in service of collective well-being through awareness messages.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, community traditions, Afro-Ecuadorian and Indigenous voices, and the principle of Sumak Kawsay / Buen Vivir.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, institutional affiliation, date of publication, stated purpose, evidence quality, and potential bias — applicable to print and digital texts.",
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year), signal phrases for reported information, and the distinction between summary and paraphrase.",
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, bias, framing, and source credibility applied to journalistic articles, social media posts, advertising, and AI-generated content; the distinction between information, opinion, and misinformation.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience; paraphrasing to simplify or clarify; glossing key terms; and explaining culturally specific concepts.",
            "EFL.5.2.d.34. Environmental and community responsibility expressed in English: vocabulary for describing environmental actions; concepts of the rights of nature and Sumak Kawsay; and participation in cause-driven school projects.",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, cohesive devices (reference, substitution, conjunction, lexical chains), and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), and concession (even though, despite).",
            "EFL.5.4.d.16. Passive voice: present simple passive and past simple passive for informational and scientific register, and modal passive (should be done, must be checked).",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, and the public service announcement — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and clearly organising information into an introduction, main points, and a conclusion with increasing independence.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school or community contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, institutional affiliation, and stated purpose.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats and explain why the source is reliable.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, purpose, and evidence quality before using them in written or oral work.",
            "EFL.5.4.p.50. Respect intellectual property in school products by crediting borrowed images, texts, sounds, and ideas using simple attribution formats and basic license information.",
            "EFL.5.2.p.37. Paraphrase a complex English statement or passage into simpler English or Spanish to clarify its meaning for a peer or community member.",
            "EFL.5.2.p.12. Conduct and respond to interviews, asking follow-up questions, requesting clarification, reformulating answers, and using active listening strategies.",
            "EFL.5.2.p.47. Use English to participate in local and global cause-driven projects, contributing written and spoken texts to shared community purposes.",
            "EFL.5.4.p.23. Compose journalistic chronicles that integrate narrative and informational elements, including scene-setting, a narrative voice, sources, and a conclusion that connects the event to a broader issue.",
            "EFL.5.4.p.32. Revise one’s own and peers’ drafts using a rubric that covers content, organization, language range, accuracy, and audience awareness, and provide constructive written feedback.",
            "EFL.5.4.p.33. Rewrite drafts to improve cohesion and grammatical accuracy, making targeted corrections to verb tenses, connectors, article use, and vocabulary range.",
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose, audience, and register, using appropriate openings, main content, requests or calls to action, and closings.",
            "EFL.5.2.p.46. Communicate ideas about environmental responsibility, sustainable practices, and community actions in English, using vocabulary for environmental topics and the rights of nature.",
            "EFL.5.4.p.28. Write structured reports with clearly labelled sections (objective, procedure, results, conclusion), using impersonal and passive voice appropriately.",
          ],
          actitudinales: [
            "EFL.5.2.a.12. Value mediation through summarizing, paraphrasing, glossing, and explaining as a meaningful communicative act that bridges languages and cultures.",
            "EFL.5.4.a.17. Value self-assessment and peer assessment as useful tools for learning, engaging with them honestly and constructively.",
            "EFL.5.2.a.20. Value local knowledge, ancestral practices, and community voices as sources of insight and wisdom worth documenting and sharing in English.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing, editing, and revision processes, treating peers’ texts with respect and offering feedback that is specific and constructive.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability, the rights of nature, and environmental actions in the community.",
            "EFL.5.2.a.21. Demonstrate responsibility toward the school community by using English skills in service of collective well-being through campaigns, awareness messages, and shared documentation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, community traditions, Afro-Ecuadorian and Indigenous voices, and the principle of Sumak Kawsay / Buen Vivir as a framework for sustainable living.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
            "EFL.5.3.d.12. Basic source evaluation criteria: authorship, institutional affiliation, date of publication, stated purpose, evidence quality, and potential bias — applicable to print and digital texts, including AI-generated content.",
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year), signal phrases for reported information, and the distinction between summary, paraphrase, and quotation.",
            "EFL.5.3.d.32. Media literacy principles: purpose, audience, bias, framing, and source credibility applied to journalistic articles, social media posts, advertising, and AI-generated content; the distinction between information, opinion, and misinformation.",
            "EFL.5.2.d.36. Strategies for mediating texts and meaning: summarizing the main points of an English text for a non-English-speaking audience; paraphrasing to simplify or clarify; glossing key terms; and explaining culturally specific concepts.",
            "EFL.5.2.d.34. Environmental and community responsibility expressed in English: vocabulary for describing environmental actions; concepts of the rights of nature and Sumak Kawsay; and participation in cause-driven school and community projects.",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, cohesive devices (reference, substitution, conjunction, lexical chains), and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), concession (even though, despite, despite), and condition (if, unless, provided that).",
            "EFL.5.4.d.16. Passive voice: present simple passive and past simple passive for informational and scientific register; modal passive (should be done, must be checked); and the causative have/get + object + past participle for services and life situations.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, the public service announcement, and meeting notes — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and clearly organising information into an introduction, main points, and a conclusion.",
            "EFL.5.2.p.39. Act as an informal interpreter for short exchanges in school or community contexts, facilitating communication between English and Spanish speakers with accuracy and respect.",
            "EFL.5.3.p.20. Evaluate the basic credibility of a written or digital source using criteria of authorship, date, institutional affiliation, and stated purpose.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats (e.g., According to …, Source: …, [Author, Year]) and explain why the source is reliable.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, purpose, and evidence quality before using them in written or oral work.",
            "EFL.5.4.p.50. Respect intellectual property in school products: credit images, texts, sounds, and ideas borrowed from others using simple attribution formats and basic license information.",
            "EFL.5.2.p.12. Conduct and respond to interviews, asking follow-up questions, requesting clarification, reformulating answers, and using active listening strategies.",
            "EFL.5.2.p.47. Use English to participate in local and global cause-driven projects — anti-discrimination campaigns, environmental initiatives, heritage documentation — contributing written and spoken texts to shared community purposes.",
            "EFL.5.4.p.23. Compose journalistic chronicles that integrate narrative and informational elements, include scene-setting, a narrative voice, sources, and a conclusion that connects the event to a broader issue.",
            "EFL.5.4.p.32. Revise one’s own and peers’ drafts using a rubric that covers content, organization, language range, accuracy, and audience awareness, and provide constructive written feedback.",
            "EFL.5.4.p.33. Rewrite the draft to improve cohesion and grammatical accuracy, making targeted corrections to verb tenses, connectors, article use, and vocabulary range.",
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose, audience, and register — openings, main content, requests or calls to action, and appropriate closings.",
            "EFL.5.2.p.46. Communicate ideas about environmental responsibility, sustainable practices, and community actions in English, using vocabulary for environmental topics and the rights of nature.",
            "EFL.5.4.p.28. Write structured reports with clearly labelled sections (objective, procedure, results, conclusion) using impersonal and passive voice appropriately.",
          ],
          actitudinales: [
            "EFL.5.2.a.12. Value mediation — summarizing, paraphrasing, glossing, explaining — is a meaningful communicative act that bridges languages, cultures, and knowledge systems.",
            "EFL.5.4.a.17. Value self-assessment and peer assessment as fair and useful tools for learning, engaging with them honestly and constructively.",
            "EFL.5.2.a.20. Value local knowledge, ancestral practices, and community voices as sources of insight and wisdom worth documenting and sharing in English.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing, editing, and revision processes, treating peers’ texts with respect and offering feedback that is specific, constructive, and kind.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability, the rights of nature, and community-based environmental actions.",
            "EFL.5.2.a.21. Demonstrate a sense of responsibility toward the school community by using English skills in service of collective well-being — through campaigns, awareness messages, and shared documentation.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.21",
    descripcion: "Documenting cultural events through photo reports featuring images, captions, and short texts to share community experiences with wider audiences and recognize photography as a form of collective memory",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, and community traditions.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, and the biographical text — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.2.p.40. Mediate cultural concepts such as practices, values, or references specific to one culture, explaining their meaning to an audience unfamiliar with them.",
            "EFL.5.2.p.45. Describe local landscapes, urban and rural spaces, natural features, and community traditions in English with sensory detail and cultural respect.",
            "EFL.5.4.p.34. Integrate visuals and text in multimodal products such as posters and digital publications so that they contribute to the overall message.",
            "EFL.5.4.p.50. Respect intellectual property in school products by crediting images, texts, sounds, and ideas borrowed from others using simple attribution formats.",
            "EFL.5.4.p.26. Produce short reviews of familiar films, books, places, or events using the description-opinion-recommendation structure and evaluative vocabulary.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing main events from background information in familiar contexts.",
            "EFL.5.4.p.52. Produce school products responsibly, asking for permission before including another person’s image, voice, or work.",
            "EFL.5.4.p.29. Produce captions and accompanying text for photo essays and vlogs that integrate visual and written information coherently.",
            "EFL.5.2.p.47. Use English to participate in local cause-driven projects, contributing short written and spoken texts to shared community purposes.",
            "EFL.5.4.p.23. Compose short journalistic chronicles that integrate narrative and informational elements, including scene-setting, a narrative voice, and sources.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production, such as vlogs and photo-essays, as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.2.a.20. Value local knowledge and community practices as sources of insight and wisdom worth sharing in English.",
            "EFL.5.2.a.21. Demonstrate responsibility toward the school community by using English skills in service of collective well-being through awareness messages.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, community traditions, Afro-Ecuadorian and Indigenous voices, and the principle of Sumak Kawsay / Buen Vivir.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, compound nouns, complex noun phrases, and genitive (‘s, s’, double genitive).",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, and the public service announcement — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.2.p.40. Mediate cultural concepts across two cultural contexts, explaining their meaning and significance to an audience unfamiliar with them.",
            "EFL.5.2.p.45. Describe local landscapes, urban and rural spaces, natural features, and community traditions in English with sensory detail and cultural respect. Integrate visuals and text in multimodal products, including photo-essays and illustrated anthologies, so that each mode contributes meaningfully to the overall message.",
            "EFL.5.4.p.50. Respect intellectual property in school products by crediting borrowed images, texts, sounds, and ideas using simple attribution formats and basic license information.",
            "EFL.5.4.p.26. Produce reviews of films, books, places, or events using the description-opinion-recommendation structure, evaluative vocabulary, and explicit criteria.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing background information from the main events with greater independence.",
            "EFL.5.4.p.52. Write, record, or publish school products responsibly, asking for permission before including another person’s image, voice, or work and recognizing the importance of ethical representation.",
            "EFL.5.4.p.29. Produce captions and accompanying text for photo essays and vlogs that integrate visual and written information coherently, citing sources.",
            "EFL.5.2.p.47. Use English to participate in local and global cause-driven projects, contributing written and spoken texts to shared community purposes.",
            "EFL.5.4.p.23. Compose journalistic chronicles that integrate narrative and informational elements, including scene-setting, a narrative voice, sources, and a conclusion that connects the event to a broader issue.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, and illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.2.a.20. Value local knowledge, ancestral practices, and community voices as sources of insight and wisdom worth documenting and sharing in English.",
            "EFL.5.2.a.21. Demonstrate responsibility toward the school community by using English skills in service of collective well-being through campaigns, awareness messages, and shared documentation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.31. Local Ecuadorian culture, heritage, and identity expressed in English: natural landscapes, ancestral knowledge, community traditions, Afro-Ecuadorian and Indigenous voices, and the principle of Sumak Kawsay / Buen Vivir as a framework for sustainable living.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, compound nouns, complex noun phrases, genitive (‘s, s’, double genitive), and relative clauses with who, which, and that.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, the public service announcement, and meeting notes — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.2.p.40. Mediate cultural concepts — practices, values, or references specific to one culture — across two cultural contexts, explaining their meaning and significance to an audience unfamiliar with them.",
            "EFL.5.4.p.34. Integrate visuals and text in multimodal products (posters, digital publications, photo-essays, illustrated anthologies) so that each mode contributes meaningfully to the overall message.",
            "EFL.5.4.p.50. Respect intellectual property in school products: credit images, texts, sounds, and ideas borrowed from others using simple attribution formats and basic license information.",
            "EFL.5.4.p.26. Produce reviews of films, books, places, or events using the description-opinion-recommendation structure, evaluative vocabulary, and explicit criteria.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing background information from the main events.",
            "EFL.5.4.p.52. Write, record, or publish school products responsibly, asking for permission before including another person’s image, voice, or work and recognizing the importance of ethical representation.",
            "EFL.5.4.p.29. Produce captions and accompanying text for photo essays and vlogs that integrate visual and written information coherently, citing sources and crediting contributors.",
            "EFL.5.2.p.47. Use English to participate in local and global cause-driven projects — anti-discrimination campaigns, environmental initiatives, heritage documentation — contributing written and spoken texts to shared community purposes.",
            "EFL.5.4.p.23. Compose journalistic chronicles that integrate narrative and informational elements, include scene-setting, a narrative voice, sources, and a conclusion that connects the event to a broader issue.",
          ],
          actitudinales: [
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.2.a.20. Value local knowledge, ancestral practices, and community voices as sources of insight and wisdom worth documenting and sharing in English.",
            "EFL.5.2.a.21. Demonstrate a sense of responsibility toward the school community by using English skills in service of collective well-being — through campaigns, awareness messages, and shared documentation.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.22",
    descripcion: "Communicating scientific processes through short reports on classroom experiments, structured into objective, procedure, results, and conclusion, to present findings and recognize school-based scientific inquiry",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year) and signal phrases for reported information.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language (according to, it is reported that, in my view, I believe) and basic evaluative language.",
            "EFL.5.2.d.17. Universal truths; Type 1 (If + present simple + will) for real future possibilities; Type 2 (If + past simple + would) for hypothetical or counterfactual situations, including “If I were you”. Conditional sentences: Type 0 for scientific and universal truths and Type 1 (If + present simple + will) for real future possibilities.",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although), cause (because, since, as), result (therefore, as a result, so), addition (in addition, furthermore), and exemplification (for example, for instance, such as).",
            "EFL.5.4.d.16. Passive voice: present simple passive and past simple passive for informational and scientific register.",
            "EFL.5.4.d.38. Language-learning strategies: planning and goal-setting for a learning task; monitoring comprehension and production using checklists; and self-correcting with grammar and vocabulary references.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, and the biographical text — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and organising information into an introduction, main points, and a conclusion with guidance.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps with guidance.",
            "EFL.5.2.p.48. Use AI tools as a language-learning aid, acknowledging AI assistance in schoolwork and comparing AI-generated responses with reliable sources.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, and purpose before using them in written or oral work.",
            "EFL.5.2.p.38. Gloss key terms in English or Spanish so that a reader unfamiliar with the field can follow the text.",
            "EFL.5.3.p.19. Distinguish basic differences between facts and opinions in news reports, opinion columns, and reviews, using signal language as a guide.",
            "EFL.5.3.p.21. Compare two short texts on the same topic, identifying shared ideas and differences in framing.",
            "EFL.5.4.p.43. Record and recycle new vocabulary using vocabulary notebooks and flashcard systems, organizing entries by topic and example sentences.",
            "EFL.5.4.p.28. Write short structured reports with clearly labelled sections for objective, procedure, results, and conclusion.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, and seeking help when needed.",
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts beyond those assigned in class.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year), signal phrases for reported information, and the distinction between summary and paraphrase.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language, hedging (might, may, could, seems to), and evaluative language (unfortunately, remarkably, clearly).",
            "EFL.5.2.d.17. Conditional sentences: Type 0 for scientific and universal truths; Type 1 (If + present simple + will) for real future possibilities; and Type 2 (If + past simple + would) for hypothetical situations.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, compound nouns, complex noun phrases, and genitive (‘s, s’, double genitive).",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, cohesive devices (reference, substitution, conjunction, lexical chains), and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), and concession (even though, despite).",
            "EFL.5.4.d.16. Passive voice: present simple passive and past simple passive for informational and scientific register, and modal passive (should be done, must be checked).",
            "EFL.5.4.d.38. Language-learning strategies: planning and goal-setting for a learning task; monitoring comprehension and production using checklists; self-correcting with grammar and vocabulary references; recording and recycling vocabulary through notebooks and flashcards; and reflecting on error patterns.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, and the public service announcement — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and clearly organising information into an introduction, main points, and a conclusion with increasing independence.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats and explain why the source is reliable.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps and a time frame.",
            "EFL.5.2.p.48. Use AI tools ethically as a language-learning aid, acknowledging AI assistance in schoolwork, comparing AI-generated responses with reliable sources, and avoiding submitting AI-generated text as one’s own.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, purpose, and evidence quality before using them in written or oral work.",
            "EFL.5.2.p.38. Gloss technical, cultural, or discipline-specific key terms in English or Spanish so that a reader unfamiliar with the field can follow the text.",
            "EFL.5.3.p.19. Distinguish facts from opinions in news reports, opinion columns, and reviews, using signal language and hedging markers as guides.",
            "EFL.5.3.p.21. Synthesize information across two short texts on the same topic, identifying shared ideas, differences in framing, and points of complementarity.",
            "EFL.5.4.p.43. Record and recycle new vocabulary systematically using vocabulary notebooks, flashcard systems, and spaced repetition, organizing entries by topic, collocations, and example sentences.",
            "EFL.5.4.p.28. Write structured reports with clearly labelled sections (objective, procedure, results, conclusion), using impersonal and passive voice appropriately.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, reflecting on progress, and seeking help when needed.",
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts — literary, journalistic, scientific, and multimodal — beyond those assigned in class.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability, the rights of nature, and environmental actions in the community.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.4.d.13. Referencing and attribution conventions: in-text citation using simple formats (Author, Year), signal phrases for reported information, and the distinction between summary, paraphrase, and quotation.",
            "EFL.5.3.d.11. Distinguishing facts from opinions in journalistic and informational texts: signal language (according to, it is reported that, in my view, I believe), hedging (might, may, could, seems to), and evaluative language (unfortunately, remarkably, clearly).",
            "EFL.5.2.d.17. Conditional sentences: Type 0 for scientific and universal truths; Type 1 (If + present simple + will) for real future possibilities; Type 2 (If + past simple + would) for hypothetical or counterfactual situations, including “If I were you”.",
            "EFL.5.2.d.21. Noun phrase complexity: singular/plural (regular and irregular), countable/uncountable with some/any, abstract nouns, compound nouns, complex noun phrases, genitive (‘s, s’, double genitive), and relative clauses with who, which, and that.",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, cohesive devices (reference, substitution, conjunction, lexical chains), and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), concession (even though, despite, despite), and condition (if, unless, provided that).",
            "EFL.5.4.d.16. Passive voice: present simple passive and past simple passive for informational and scientific register; modal passive (should be done, must be checked); and the causative have/get + object + past participle for services and life situations.",
            "EFL.5.4.d.38. Language-learning strategies: planning and goal-setting for a learning task; monitoring comprehension and production using checklists; self-correcting with grammar and vocabulary references; recording and recycling vocabulary through notebooks, flashcards, and spaced repetition; and reflecting on error patterns to set improvement goals.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, the public service announcement, and meeting notes — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.2.p.5. Give a structured oral presentation on an academic or community topic, using visual aids and clearly organising information into an introduction, main points, and a conclusion.",
            "EFL.5.4.p.31. Cite at least one source in written work using simple, consistent attribution formats (e.g., According to …, Source: …, [Author, Year]) and explain why the source is reliable.",
            "EFL.5.4.p.41. Plan a language-learning task by setting a specific goal, selecting appropriate resources, and establishing steps and a time frame.",
            "EFL.5.2.p.48. Use AI tools ethically as a language-learning aid: acknowledge AI assistance in schoolwork, compare AI-generated responses with reliable sources, and avoid submitting AI-generated text as one’s own.",
            "EFL.5.3.p.49. Evaluate the basic credibility of online sources using criteria of authorship, date, institutional affiliation, purpose, and evidence quality before using them in written or oral work.",
            "EFL.5.2.p.38. Gloss key terms — technical, cultural, or discipline-specific words — in English or Spanish so that a reader unfamiliar with the field can follow the text.",
            "EFL.5.3.p.19. Begin to distinguish facts from opinions in news reports, opinion columns, and reviews, using signal language and hedging markers as guides.",
            "EFL.5.3.p.21. Synthesize information across two short texts on the same topic, identifying shared ideas, differences in framing, and points of complementarity.",
            "EFL.5.4.p.43. Record and recycle new vocabulary systematically using vocabulary notebooks, flashcard systems, and spaced repetition, organizing entries by topic, collocations, and example sentences.",
            "EFL.5.4.p.28. Write structured reports with clearly labelled sections (objective, procedure, results, conclusion) using impersonal and passive voice appropriately.",
          ],
          actitudinales: [
            "EFL.5.4.a.15. Demonstrate responsibility for one’s own learning by completing tasks, meeting agreed-upon timelines, reflecting honestly on progress, and proactively seeking help when needed.",
            "EFL.5.3.a.8. Demonstrate interest in reading a variety of English-language texts — literary, journalistic, scientific, multimodal — beyond those assigned in class.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability, the rights of nature, and community-based environmental actions.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.23",
    descripcion: "Creation of public service announcements in English on community issues, using clear scripts, calls to action, and peer revision to share useful information and support community well-being",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.3. Prosodic features used for emphasis and contrast: sentence stress on key information, and rising and falling intonation in statements and different question types.",
            "EFL.5.1.d.25. Sentence stress, rhythm, and timing in English as a stress-timed language: nuclear stress on new information and rhythm in natural speech.",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could (ability, polite request, permission), should/ought to (advice, expectation), must/mustn’t (obligation, prohibition), and have (got) to (external obligation).",
            "EFL.5.2.d.17. Universal truths; Type 1 (If + present simple + will) for real future possibilities; Type 2 (If + past simple + would) for hypothetical or counterfactual situations, including “If I were you”. Conditional sentences: Type 0 for scientific and universal truths and Type 1 (If + present simple + will) for real future possibilities.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, and gender equality and non-discrimination.",
            "EFL.5.2.d.34. Environmental and community responsibility expressed in English: vocabulary for describing environmental actions and concepts of the rights of nature.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, and the biographical text — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists and self-assessment rubrics.",
            "EFL.5.4.p.30. Write short video scripts for informative or community-oriented pieces, including voice-over text and basic transition notes.",
            "EFL.5.2.p.8. Explain causes and consequences of familiar social, environmental, or technological issues using Type 1 conditionals, modals, and cause-result connectors.",
            "EFL.5.2.p.47. Use English to participate in local cause-driven projects, contributing short written and spoken texts to shared community purposes.",
            "EFL.5.2.p.13. Negotiate simple plans and services, expressing preferences and suggesting alternatives using modal verbs.",
            "EFL.5.4.p.32. Revise one’s own drafts using criteria for content, organization, language accuracy, and audience awareness, with guidance.",
            "EFL.5.4.p.33. Rewrite drafts to improve cohesion and grammatical accuracy, making corrections to verb tenses, connectors, and vocabulary.",
            "EFL.5.4.p.44. Reflect on language errors and identify recurring patterns in one’s production.",
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose and audience, using appropriate openings, main content, requests, and closings.",
            "EFL.5.4.p.35. Write short public service announcements and awareness messages using a clear structure, direct address, and imperative constructions.",
            "EFL.5.2.p.46. Communicate ideas about environmental responsibility and sustainable practices in English, using vocabulary for environmental topics.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues through English with a commitment to respectful participation.",
            "EFL.5.4.a.16. Show commitment to improvement in language production, using feedback from peers and teachers as a resource for growth.",
            "EFL.5.4.a.17. Value self-assessment as a useful tool for learning and engage with it honestly.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing and revision processes, treating peers’ texts with respect and offering constructive feedback.",
            "EFL.5.4.a.14. Recognize the importance of revisiting and revising understanding after miscommunication in collaborative learning.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability.",
            "EFL.5.2.a.21. Demonstrate responsibility toward the school community by using English skills in service of collective well-being through awareness messages.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.3. Prosodic features used for emphasis and contrast: sentence stress on key information, contrastive stress, rising and falling intonation in statements and different question types, and intonation in tag questions.",
            "EFL.5.1.d.25. Sentence stress, rhythm, and timing in English as a stress-timed language: nuclear stress on new information, contrastive stress for emphasis, and the reduction of unstressed syllables in natural speech.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could, will/would, shall, should/ought to, may/might, must/mustn’t, have (got) to, and need/needn’t.",
            "EFL.5.2.d.17. Conditional sentences: Type 0 for scientific and universal truths; Type 1 (If + present simple + will) for real future possibilities; and Type 2 (If + past simple + would) for hypothetical situations.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, gender equality and non-discrimination, migration and belonging, and digital rights and algorithmic bias.",
            "EFL.5.2.d.34. Environmental and community responsibility expressed in English: vocabulary for describing environmental actions; concepts of the rights of nature and Sumak Kawsay; and participation in cause-driven school projects.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, and the public service announcement — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists, self-assessment rubrics, and peer feedback, and adjust strategies as needed.",
            "EFL.5.4.p.30. Write video scripts for short, informative or community-oriented pieces, including stage directions, voice-over text, transition notes, and a clear call to action.",
            "EFL.5.2.p.8. Explain causes and consequences of social, environmental, or technological issues using Type 1 and Type 2 conditionals, modals, and cause-result connectors.",
            "EFL.5.2.p.47. Use English to participate in local and global cause-driven projects, contributing written and spoken texts to shared community purposes.",
            "EFL.5.2.p.13. Negotiate plans and services, expressing preferences, suggesting alternatives, and reaching agreements using modal verbs and conditional structures.",
            "EFL.5.4.p.32. Revise one’s own and peers’ drafts using a rubric that covers content, organization, language range, accuracy, and audience awareness, and provide constructive written feedback.",
            "EFL.5.4.p.33. Rewrite drafts to improve cohesion and grammatical accuracy, making targeted corrections to verb tenses, connectors, article use, and vocabulary range.",
            "EFL.5.4.p.44. Reflect on language errors, identify patterns, and set specific improvement goals for the next task.",
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose, audience, and register, using appropriate openings, main content, requests or calls to action, and closings.",
            "EFL.5.4.p.35. Write short public service announcements and awareness messages using a clear structure (hook, information, call to action), direct address, and imperative or modal constructions.",
            "EFL.5.2.p.46. Communicate ideas about environmental responsibility, sustainable practices, and community actions in English, using vocabulary for environmental topics and the rights of nature.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues — climate change, gender equality, migration, and digital rights — through English with a commitment to informed and respectful participation.",
            "EFL.5.4.a.16. Show commitment to accuracy and improvement in language production, using feedback from rubrics, peers, and teachers as a resource for growth.",
            "EFL.5.4.a.17. Value self-assessment and peer assessment as useful tools for learning, engaging with them honestly and constructively.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing, editing, and revision processes, treating peers’ texts with respect and offering feedback that is specific and constructive.",
            "EFL.5.4.a.14. Recognize the importance of second chances and repair in collaborative learning, showing willingness to revisit, revise, and rebuild understanding after miscommunication or disagreement.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability, the rights of nature, and environmental actions in the community.",
            "EFL.5.2.a.21. Demonstrate responsibility toward the school community by using English skills in service of collective well-being through campaigns, awareness messages, and shared documentation.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.1.d.3. Prosodic features used for emphasis and contrast: sentence stress on key information, contrastive stress, rising and falling intonation in statements and different question types, and intonation in tag questions and lists.",
            "EFL.5.4.d.37. Self-assessment and peer assessment in language learning: rubric criteria for spoken and written production at B1; consolidated error analysis; constructive feedback language; and the distinction between accuracy, fluency, and range.",
            "EFL.5.2.d.15. Modal verbs and their functions: can/could (ability, polite request, permission), will/would (future, polite request, deduction), shall (offer, suggestion), should/ought to (advice, expectation), may/might (possibility), must/mustn’t (obligation, prohibition), have (got) to (external obligation), need/needn’t (necessity, lack of necessity), and used to + infinitive (past habits).",
            "EFL.5.2.d.17. Conditional sentences: Type 0 for scientific and universal truths; Type 1 (If + present simple + will) for real future possibilities; Type 2 (If + past simple + would) for hypothetical or counterfactual situations, including “If I were you”.",
            "EFL.5.2.d.30. Global issues: climate change and environmental responsibility, gender equality and non-discrimination, migration and belonging, digital rights and algorithmic bias, and youth civic engagement.",
            "EFL.5.2.d.34. Environmental and community responsibility expressed in English: vocabulary for describing environmental actions; concepts of the rights of nature and Sumak Kawsay; and participation in cause-driven school and community projects.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, the public service announcement, and meeting notes — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.4.p.42. Monitor comprehension and production during a task using checklists, self-assessment rubrics, and peer feedback, and adjust strategies as needed.",
            "EFL.5.4.p.30. Write video scripts for short, informative or community-oriented pieces, including stage directions, voice-over text, transition notes, and a clear call to action.",
            "EFL.5.2.p.8. Explain causes and consequences of social, environmental, or technological issues using Type 1 and Type 2 conditionals, modals, and cause-result connectors.",
            "EFL.5.2.p.47. Use English to participate in local and global cause-driven projects — anti-discrimination campaigns, environmental initiatives, heritage documentation — contributing written and spoken texts to shared community purposes.",
            "EFL.5.2.p.13. Negotiate plans and services, expressing preferences, suggesting alternatives, and reaching agreements using modal verbs and conditional structures.",
            "EFL.5.4.p.32. Revise one’s own and peers’ drafts using a rubric that covers content, organization, language range, accuracy, and audience awareness, and provide constructive written feedback.",
            "EFL.5.4.p.33. Rewrite the draft to improve cohesion and grammatical accuracy, making targeted corrections to verb tenses, connectors, article use, and vocabulary range.",
            "EFL.5.4.p.44. Reflect on language errors, identify patterns (e.g., consistent tense confusion, missing articles, calques from Spanish), and set specific improvement goals for the next task.",
            "EFL.5.4.p.27. Draft formal and informal emails and messages adapted to purpose, audience, and register — openings, main content, requests or calls to action, and appropriate closings.",
            "EFL.5.4.p.35. Write short public service announcements and awareness messages using clear structure (hook, information, call to action), direct address, and imperative or modal constructions.",
            "EFL.5.2.p.46. Communicate ideas about environmental responsibility, sustainable practices, and community actions in English, using vocabulary for environmental topics and the rights of nature.",
          ],
          actitudinales: [
            "EFL.5.2.a.7. Engage with global issues — climate change, gender equality, migration, digital rights — through English with a commitment to informed, respectful, and constructive participation.",
            "EFL.5.4.a.16. Show commitment to accuracy and improvement in language production, using feedback from rubrics, peers, and teachers as a resource for growth rather than a judgment.",
            "EFL.5.4.a.17. Value self-assessment and peer assessment as fair and useful tools for learning, engaging with them honestly and constructively.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing, editing, and revision processes, treating peers’ texts with respect and offering feedback that is specific, constructive, and kind.",
            "EFL.5.4.a.14. Recognize the importance of second chances and repair in collaborative learning: willingness to revisit, revise, and rebuild understanding after miscommunication or disagreement.",
            "EFL.5.2.a.19. Show commitment to environmental responsibility by using English to communicate about sustainability, the rights of nature, and community-based environmental actions.",
            "EFL.5.2.a.21. Demonstrate a sense of responsibility toward the school community by using English skills in service of collective well-being — through campaigns, awareness messages, and shared documentation.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.EFL.5.24",
    descripcion: "Collective production of an anthology of short autobiographies in English, including illustrations, writing, and editing, to document personal experiences and contribute to a shared institutional memory",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather.",
            "EFL.5.2.d.35. Contrastive linguistics of English: typological differences in word order, articles, and null subject, and false friends.",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; and past continuous for background actions.",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although), cause (because, since, as), result (therefore, as a result, so), addition (in addition, furthermore), and exemplification (for example, for instance, such as).",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; and gerund as subject or object.",
            "EFL.5.4.d.38. Language-learning strategies: planning and goal-setting for a learning task; monitoring comprehension and production using checklists; and self-correcting with grammar and vocabulary references.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, and the biographical text — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.4.p.34. Integrate visuals and text in multimodal products such as posters and digital publications so that they contribute to the overall message.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing main events from background information in familiar contexts.",
            "EFL.5.2.p.6. Describe experiences and memories using a range of tenses, basic discourse markers, and evaluative vocabulary.",
            "EFL.5.4.p.25. Write autobiographical narratives and biographical texts using first- or third-person narration, past tense, and chronological organization.",
            "EFL.5.4.p.29. Produce captions and accompanying text for photo essays and vlogs that integrate visual and written information coherently.",
            "EFL.5.3.p.22. Read short literary excerpts, identifying themes, narrative voice, and setting.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, and help peers express their ideas.",
            "EFL.5.4.p.32. Revise one’s own drafts using criteria for content, organization, language accuracy, and audience awareness, with guidance.",
            "EFL.5.4.p.33. Rewrite drafts to improve cohesion and grammatical accuracy, making corrections to verb tenses, connectors, and vocabulary.",
            "EFL.5.4.p.44. Reflect on language errors and identify recurring patterns in one’s production.",
          ],
          actitudinales: [
            "EFL.5.4.a.16. Show commitment to improvement in language production, using feedback from peers and teachers as a resource for growth.",
            "EFL.5.4.a.18. Recognize that language errors are a natural part of learning and show willingness to improve after correction.",
            "EFL.5.4.a.24. Engage with artistic and multimodal production, such as vlogs and photo-essays, as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.3.a.10. Value reading as a way to encounter different lives and perspectives, and recognize literature as a way to understand one’s own experience and that of others.",
            "EFL.5.4.a.23. Value creative transformation of texts, such as alternative endings and changes of voice, as a meaningful form of authorship that connects reading and writing.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing and revision processes, treating peers’ texts with respect and offering constructive feedback.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.23. Vocabulary in the same semantic fields, with particular attention to collocations and dependent prepositions.",
            "EFL.5.2.d.35. Contrastive linguistics of English: typological differences (word order, articles, null subject, periphrastic verbs), false friends, calques, and syntactic transfer errors.",
            "EFL.5.2.d.35. Contrastive linguistics of English: typological differences (word order, articles, null subject, periphrastic verbs), false friends, calques, syntactic transfer errors, and how awareness of these supports accuracy. Verb tenses for narrating and reporting: present simple, present continuous, present perfect simple, past simple, past continuous, past perfect simple for events before a past reference point, and future with will, going to, and shall.",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, cohesive devices (reference, substitution, conjunction, lexical chains), and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), and concession (even though, despite).",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; gerund as subject or object; phrasal verbs and verbs with prepositions.",
            "EFL.5.4.d.38. Language-learning strategies: planning and goal-setting for a learning task; monitoring comprehension and production using checklists; self-correcting with grammar and vocabulary references; recording and recycling vocabulary through notebooks and flashcards; and reflecting on error patterns.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, and the public service announcement — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.4.p.33. Rewrite drafts to improve cohesion and grammatical accuracy, making targeted corrections to verb tenses, connectors, article use, and vocabulary range.",
            "EFL.5.4.p.34. Integrate visuals and text in multimodal products, including photo-essays and illustrated anthologies, so that each mode contributes meaningfully to the overall message.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing background information from the main events with greater independence.",
            "EFL.5.2.p.6. Describe experiences, memories, dreams, and future ambitions using a range of tenses, discourse markers, and evaluative vocabulary.",
            "EFL.5.4.p.25. Write autobiographical narratives and biographical texts using first- or third-person narration, past tense, chronological organization, and evaluative reflection on events.",
            "EFL.5.4.p.29. Produce captions and accompanying text for photo essays and vlogs that integrate visual and written information coherently, citing sources.",
            "EFL.5.3.p.22. Read short literary excerpts — stories, autobiographical fragments, song lyrics — and identify themes, narrative voice, setting, and the ways the author creates meaning.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, give and receive constructive feedback, and help peers express their ideas.",
            "EFL.5.4.p.32. Revise one’s own and peers’ drafts using a rubric that covers content, organization, language range, accuracy, and audience awareness, and provide constructive written feedback.",
            "EFL.5.4.p.44. Reflect on language errors, identify patterns, and set specific improvement goals for the next task.",
          ],
          actitudinales: [
            "EFL.5.4.a.16. Show commitment to accuracy and improvement in language production, using feedback from rubrics, peers, and teachers as a resource for growth.",
            "EFL.5.4.a.18. Recognize that language errors are a natural and necessary part of learning, and develop resilience in response to difficulty or correction.",
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, and illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.3.a.10. Value the act of reading as a way to encounter different lives, perspectives, and questions, and recognize literature as a way to understand one’s own experience and that of others.",
            "EFL.5.4.a.23. Value creative transformation of texts — remixes, alternative endings, and changes of voice — as a legitimate and meaningful form of authorship that connects reading and writing.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing, editing, and revision processes, treating peers’ texts with respect and offering feedback that is specific and constructive.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "EFL.5.2.d.23. Vocabulary: Clothes, Daily life, Education, Entertainment and media, Environment, Food and drink, Free time, Health medicine and exercise, Hobbies and leisure, House and home, Language, People, Personal feelings experiences and opinions, Personal identification, Places and buildings, Relations with other people, Services, Shopping, Social interaction, Sport, The natural world, Transport, Travel and holidays, Weather — with particular attention to collocations, dependent prepositions, and register variation within each field.",
            "EFL.5.2.d.14. Verb tenses for narrating and reporting: present simple for habits, states, and timeless truths; present continuous for current actions and future arrangements; present perfect simple with just, already, yet, ever, never, for, since; past simple for completed events; past continuous for background actions; past perfect simple for events before a past reference point; future with will, going to, and shall; and was/were going to for unfulfilled intentions.",
            "EFL.5.4.d.9. Text organisation principles: introduction-body-conclusion structure, paragraph unity and development, cohesive devices (reference, substitution, conjunction, lexical chains), and the role of topic sentences and supporting details.",
            "EFL.5.4.d.19. Connectors and discourse markers for written cohesion: contrast (however, although, whereas, while, on the other hand), cause (because, since, as, due to), result (therefore, as a result, so, consequently), addition (in addition, furthermore, moreover), exemplification (for example, for instance, such as), concession (even though, despite, despite), and condition (if, unless, provided that).",
            "EFL.5.2.d.22. Verb complementation patterns: infinitive with and without to after verbs and adjectives; gerund after verbs and prepositions; gerund as subject or object; phrasal verbs and verbs with prepositions; and verb + object + infinitive patterns (give/take/send + direct/indirect object).",
            "EFL.5.4.d.38. Language-learning strategies: planning and goal-setting for a learning task; monitoring comprehension and production using checklists; self-correcting with grammar and vocabulary references; recording and recycling vocabulary through notebooks, flashcards, and spaced repetition; and reflecting on error patterns to set improvement goals.",
            "EFL.5.4.d.8. Academic and functional written genres: the report with sections (objective, procedure, results, conclusion), the formal and informal email, the biographical and autobiographical text, the photo-essay, the public service announcement, and meeting notes — structure and register conventions for each.",
          ],
          procedimentales: [
            "EFL.5.4.p.34. Integrate visuals and text in multimodal products (posters, digital publications, photo-essays, illustrated anthologies) so that each mode contributes meaningfully to the overall message.",
            "EFL.5.2.p.7. Recount events chronologically using past tenses, time markers, and sequence connectors, distinguishing background information from the main events.",
            "EFL.5.2.p.6. Describe experiences, memories, dreams, and future ambitions using a range of tenses, discourse markers, and evaluative vocabulary.",
            "EFL.5.4.p.25. Write autobiographical narratives and biographical texts using first- or third-person narration, past tense, chronological organization, and evaluative reflection on events.",
            "EFL.5.4.p.29. Produce captions and accompanying text for photo essays and vlogs that integrate visual and written information coherently, citing sources and crediting contributors.",
            "EFL.5.3.p.22. Read short literary excerpts — stories, autobiographical fragments, song lyrics — and identify themes, narrative voice, setting, and the ways the author creates meaning.",
            "EFL.5.2.p.51. Cooperate respectfully in pairs and groups: take turns, listen actively, give and receive constructive feedback, and help peers express their ideas.",
            "EFL.5.4.p.32. Revise one’s own and peers’ drafts using a rubric that covers content, organization, language range, accuracy, and audience awareness, and provide constructive written feedback.",
            "EFL.5.4.p.33. Rewrite the draft to improve cohesion and grammatical accuracy, making targeted corrections to verb tenses, connectors, article use, and vocabulary range.",
            "EFL.5.4.p.44. Reflect on language errors, identify patterns (e.g., consistent tense confusion, missing articles, calques from Spanish), and set specific improvement goals for the next task.",
          ],
          actitudinales: [
            "EFL.5.4.a.16. Show commitment to accuracy and improvement in language production, using feedback from rubrics, peers, and teachers as a resource for growth rather than a judgment.",
            "EFL.5.4.a.18. Recognize that language errors are a natural and necessary part of learning, and develop resilience and a growth mindset in response to difficulty or correction.",
            "EFL.5.4.a.24. Engage with artistic and multimodal production — vlogs, photo-essays, audio guides, illustrated anthologies — as expressive acts that contribute one’s own voice to a shared cultural record.",
            "EFL.5.3.a.10. Value the act of reading as a way to encounter different lives, perspectives, and questions, and recognize literature as both a mirror and a window for understanding one’s own experience and that of others.",
            "EFL.5.4.a.23. Value creative transformation of texts — remixes, alternative endings, changes of voice — as a legitimate and meaningful form of authorship that connects reading and writing.",
            "EFL.5.4.a.13. Engage cooperatively in collaborative writing, editing, and revision processes, treating peers’ texts with respect and offering feedback that is specific, constructive, and kind.",
          ],
        },
      },
    ],
  },
];

export function buscarCompetenciaIngles(codigo: string): CompetenciaEspecificaCompleta | undefined {
  return COMPETENCIAS_INGLES.find((c) => c.codigo === codigo);
}
