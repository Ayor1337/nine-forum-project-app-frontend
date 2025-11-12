// app/api/live2d-chat/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // 关键：使用 Node 运行时
export const dynamic = "force-dynamic"; // 可选：禁用缓存，便于开发调试

type ChatMsg = { id: string; role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  try {
    const { input, history } = (await req.json()) as {
      input: string;
      history: ChatMsg[];
    };

    // —— 这里开始才引入 Node-only 依赖 ——
    const [
      { ChatOpenAI },
      { ChatPromptTemplate, MessagesPlaceholder },
      { RunnableSequence },
    ] = await Promise.all([
      import("@langchain/openai"),
      import("@langchain/core/prompts"),
      import("@langchain/core/runnables"),
    ]);

    // 你以前用的是 DeepSeek
    const model = new ChatOpenAI({
      apiKey: process.env.DS_API_KEY || process.env.NEXT_PUBLIC_DS_API_KEY, // 建议使用服务端专用变量
      model: "deepseek-chat",
      temperature: 0.7,
      configuration: { baseURL: "https://api.deepseek.com/v1" },
    });

    // 可选：RAG（如果 Chroma 可用就查，否则回退为无 RAG）
    let context = "";
    try {
      const [{ AlibabaTongyiEmbeddings }, { Chroma }] = await Promise.all([
        import("@langchain/community/embeddings/alibaba_tongyi"),
        import("@langchain/community/vectorstores/chroma"),
      ]);

      const embedModel = new AlibabaTongyiEmbeddings({
        apiKey:
          process.env.QWEN_API_KEY || process.env.NEXT_PUBLIC_QWEN_API_KEY,
        modelName: "text-embedding-v4",
      });

      // 连接现有 Chroma（注意：URL 必须是 Chroma Server 的地址，且是 http(s)://host:port）
      const vectorStore = new Chroma(embedModel, {
        collectionName: process.env.CHROMA_COLLECTION || "houmra",
        url: process.env.CHROMA_URL || "http://127.0.0.1:8000", // ← 改成你的实际 Chroma 地址
      });

      const hits = await vectorStore.similaritySearch(input, 5);
      context =
        hits
          ?.map((d) => `【${d.metadata?.source ?? "doc"}】\n${d.pageContent}`)
          .join("\n\n") ?? "";
    } catch (e) {
      // RAG 失败就忽略，走纯对话
      console.warn("RAG disabled:", e);
    }

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        [
          "你要扮演《魔法少女小圆》的晓美焰。",
          "优先使用给定的上下文回答，如果上下文没有明确答案，再结合常识。",
          "如果不确定，就坦诚说明不确定，不要编造。",
          `上下文：\n${context || "（无命中上下文）"}`,
        ].join("\n"),
      ],
      new MessagesPlaceholder("history"),
      ["human", "{input}"],
    ]);

    const chain = RunnableSequence.from([prompt, model]);

    const aiMsg = await chain.invoke({
      history: (history || []).map((m: ChatMsg) => ({
        role: m.role,
        content: m.content,
      })),
      input,
    });

    const content = (aiMsg as any)?.content ?? String(aiMsg ?? "");

    return NextResponse.json({ data: { content } });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? "internal error" },
      { status: 500 }
    );
  }
}
