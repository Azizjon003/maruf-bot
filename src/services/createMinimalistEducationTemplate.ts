import PptxGenJS from "pptxgenjs";

/**
 * Creates a minimalist, user-friendly education template with clean layouts
 * Designed for easy readability and content focus
 */
export const createMinimalistEducationTemplate = async () => {
  // Initialize presentation
  const pptx = new PptxGenJS();
  pptx.theme = { bodyFontFace: "Arial" };

  // Color palette - minimalist with accessibility in mind
  const colors = {
    primary: "1A73E8", // Blue
    secondary: "4285F4", // Lighter blue
    accent: "34A853", // Green
    neutral1: "5F6368", // Dark gray
    neutral2: "BDC1C6", // Light gray
    dark: "202124", // Almost black
    light: "FFFFFF", // White
    lightBg: "F8F9FA", // Off-white
  };

  // ===== SLIDE 1: COVER SLIDE =====
  const slide1 = pptx.addSlide();

  // Clean white background
  slide1.background = { color: colors.light };

  // Left side accent bar
  slide1.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 1.2,
    h: 7.5,
    fill: { color: colors.primary },
  });

  // Title
  slide1.addText("Education Simplified", {
    x: 1.5,
    y: 2.5,
    w: 8,
    h: 1,
    fontSize: 40,
    fontFace: "Arial",
    color: colors.dark,
    bold: true,
  });

  // Subtitle
  slide1.addText("A Minimalist Approach to Learning", {
    x: 1.5,
    y: 3.5,
    w: 8,
    h: 0.6,
    fontSize: 24,
    fontFace: "Arial",
    color: colors.primary,
  });

  // Author
  slide1.addText("Presented by: Course Creator", {
    x: 1.5,
    y: 5.5,
    w: 8,
    h: 0.4,
    fontSize: 14,
    fontFace: "Arial",
    color: colors.neutral1,
  });

  // Date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  slide1.addText(formattedDate, {
    x: 1.5,
    y: 6,
    w: 8,
    h: 0.4,
    fontSize: 14,
    fontFace: "Arial",
    color: colors.neutral1,
  });

  // ===== SLIDE 2: AGENDA =====
  const slide2 = pptx.addSlide();

  // Header
  slide2.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 1,
    fill: { color: colors.primary },
  });

  slide2.addText("Course Agenda", {
    x: 0.5,
    y: 0.25,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: colors.light,
    bold: true,
  });

  // Subtle background
  slide2.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1,
    w: 10,
    h: 6.5,
    fill: { color: colors.lightBg },
  });

  // Introduction text
  slide2.addText(
    "In this course, we will cover the following topics in a simple, straightforward approach:",
    {
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 0.5,
      fontSize: 16,
      fontFace: "Arial",
      color: colors.dark,
    }
  );

  // Agenda items
  const agendaItems = [
    "Fundamentals of Learning",
    "Study Techniques",
    "Memory Enhancement",
    "Critical Thinking Skills",
    "Practical Applications",
    "Assessment Strategies",
  ];

  agendaItems.forEach((item, i) => {
    // Number circle
    slide2.addShape(pptx.ShapeType.ellipse, {
      x: 0.7,
      y: 2 + i * 0.7,
      w: 0.4,
      h: 0.4,
      fill: { color: colors.primary },
    });

    // Number
    slide2.addText(`${i + 1}`, {
      x: 0.7,
      y: 2 + i * 0.7,
      w: 0.4,
      h: 0.4,
      fontSize: 14,
      fontFace: "Arial",
      color: colors.light,
      bold: true,
      align: "center",
      valign: "middle",
    });

    // Agenda item
    slide2.addText(item, {
      x: 1.3,
      y: 1.95 + i * 0.7,
      w: 8,
      h: 0.5,
      fontSize: 18,
      fontFace: "Arial",
      color: colors.dark,
    });
  });

  // ===== SLIDE 3: CONTENT SLIDE WITH TWO COLUMNS =====
  const slide3 = pptx.addSlide();

  // Header
  slide3.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 1,
    fill: { color: colors.primary },
  });

  slide3.addText("Key Concepts", {
    x: 0.5,
    y: 0.25,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: colors.light,
    bold: true,
  });

  // Clean white background
  slide3.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1,
    w: 10,
    h: 6.5,
    fill: { color: colors.light },
  });

  // Left Column - Definition
  slide3.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 1.3,
    w: 4.2,
    h: 0.6,
    fill: { color: colors.primary },
  });

  slide3.addText("Definition", {
    x: 0.5,
    y: 1.3,
    w: 4.2,
    h: 0.6,
    fontSize: 20,
    fontFace: "Arial",
    color: colors.light,
    bold: true,
    align: "center",
    valign: "middle",
  });

  slide3.addText(
    "Learning is the process of acquiring new understanding, knowledge, behaviors, skills, values, attitudes, and preferences.",
    {
      x: 0.5,
      y: 2,
      w: 4.2,
      h: 2,
      fontSize: 16,
      fontFace: "Arial",
      color: colors.dark,
      align: "left",
      valign: "top",
    }
  );

  // Right Column - Key Elements
  slide3.addShape(pptx.ShapeType.rect, {
    x: 5.3,
    y: 1.3,
    w: 4.2,
    h: 0.6,
    fill: { color: colors.accent },
  });

  slide3.addText("Key Elements", {
    x: 5.3,
    y: 1.3,
    w: 4.2,
    h: 0.6,
    fontSize: 20,
    fontFace: "Arial",
    color: colors.light,
    bold: true,
    align: "center",
    valign: "middle",
  });

  const keyElements = [
    "Focus and attention",
    "Comprehension",
    "Memory retention",
    "Practical application",
    "Feedback and adjustment",
  ];

  keyElements.forEach((element, i) => {
    slide3.addShape(pptx.ShapeType.roundRect, {
      x: 5.4,
      y: 2.1 + i * 0.5,
      w: 0.1,
      h: 0.3,
      fill: { color: colors.accent },
      rectRadius: 0.05,
    });

    slide3.addText(element, {
      x: 5.7,
      y: 2 + i * 0.5,
      w: 3.8,
      h: 0.5,
      fontSize: 16,
      fontFace: "Arial",
      color: colors.dark,
    });
  });

  // Bottom section with additional information
  slide3.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 0.6,
    fill: { color: colors.neutral2 },
  });

  slide3.addText("Application in Education", {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 0.6,
    fontSize: 20,
    fontFace: "Arial",
    color: colors.dark,
    bold: true,
    align: "center",
    valign: "middle",
  });

  slide3.addText(
    "Understanding these concepts helps educators design more effective learning experiences that cater to different learning styles and cognitive processes.",
    {
      x: 0.5,
      y: 5.2,
      w: 9,
      h: 1,
      fontSize: 16,
      fontFace: "Arial",
      color: colors.dark,
      align: "center",
    }
  );

  // ===== SLIDE 4: PROCESS SLIDE =====
  const slide4 = pptx.addSlide();

  // Header
  slide4.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 1,
    fill: { color: colors.primary },
  });

  slide4.addText("Learning Process", {
    x: 0.5,
    y: 0.25,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: colors.light,
    bold: true,
  });

  // Clean white background
  slide4.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1,
    w: 10,
    h: 6.5,
    fill: { color: colors.light },
  });

  // Process steps
  const processSteps = [
    {
      title: "Input",
      description:
        "Receiving information through reading, listening, or observation",
    },
    {
      title: "Processing",
      description: "Understanding and organizing the information in your mind",
    },
    {
      title: "Storage",
      description:
        "Retaining the information in short-term or long-term memory",
    },
    {
      title: "Output",
      description:
        "Demonstrating knowledge through application or communication",
    },
  ];

  // Create the process flow
  processSteps.forEach((step, i) => {
    // Box for each step
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + i * 2.4,
      y: 2,
      w: 2,
      h: 1.8,
      fill: { color: colors.lightBg },
      line: { color: colors.primary, width: 2 },
      rectRadius: 0.1,
    });

    // Step title
    slide4.addText(step.title, {
      x: 0.5 + i * 2.4,
      y: 2.2,
      w: 2,
      h: 0.5,
      fontSize: 18,
      fontFace: "Arial",
      color: colors.primary,
      bold: true,
      align: "center",
    });

    // Step description
    slide4.addText(step.description, {
      x: 0.6 + i * 2.4,
      y: 2.7,
      w: 1.8,
      h: 1,
      fontSize: 14,
      fontFace: "Arial",
      color: colors.dark,
      align: "center",
    });

    // Arrow connecting steps (except after the last step)
    if (i < processSteps.length - 1) {
      slide4.addShape(pptx.ShapeType.line, {
        x: 2.5 + i * 2.4,
        y: 2.9,
        w: 0.4,
        h: 0,
        line: { color: colors.primary, width: 2 },
        lineHead: "arrow",
      });
    }
  });

  // Additional explanation at the bottom
  slide4.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 2,
    fill: { color: colors.lightBg },
  });

  slide4.addText("Effective Learning", {
    x: 0.5,
    y: 4.6,
    w: 9,
    h: 0.5,
    fontSize: 18,
    fontFace: "Arial",
    color: colors.primary,
    bold: true,
    align: "center",
  });

  slide4.addText(
    "The learning process is most effective when all four stages are intentionally addressed. " +
      "Students benefit from clear input, structured processing activities, memory retention techniques, " +
      "and opportunities to demonstrate their knowledge through practical application.",
    {
      x: 0.8,
      y: 5.1,
      w: 8.4,
      h: 1.3,
      fontSize: 14,
      fontFace: "Arial",
      color: colors.dark,
      align: "left",
    }
  );

  // ===== SLIDE 5: COMPARISON SLIDE =====
  const slide5 = pptx.addSlide();

  // Header
  slide5.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 1,
    fill: { color: colors.primary },
  });

  slide5.addText("Learning Approaches", {
    x: 0.5,
    y: 0.25,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: colors.light,
    bold: true,
  });

  // Content background
  slide5.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1,
    w: 10,
    h: 6.5,
    fill: { color: colors.light },
  });

  // Table headers
  slide5.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 1.5,
    w: 3,
    h: 0.6,
    fill: { color: colors.primary },
  });

  slide5.addText("Traditional", {
    x: 0.5,
    y: 1.5,
    w: 3,
    h: 0.6,
    fontSize: 18,
    fontFace: "Arial",
    color: colors.light,
    bold: true,
    align: "center",
    valign: "middle",
  });

  slide5.addShape(pptx.ShapeType.rect, {
    x: 3.5,
    y: 1.5,
    w: 3,
    h: 0.6,
    fill: { color: colors.accent },
  });

  slide5.addText("Modern", {
    x: 3.5,
    y: 1.5,
    w: 3,
    h: 0.6,
    fontSize: 18,
    fontFace: "Arial",
    color: colors.light,
    bold: true,
    align: "center",
    valign: "middle",
  });

  slide5.addShape(pptx.ShapeType.rect, {
    x: 6.5,
    y: 1.5,
    w: 3,
    h: 0.6,
    fill: { color: colors.secondary },
  });

  slide5.addText("Best Practice", {
    x: 6.5,
    y: 1.5,
    w: 3,
    h: 0.6,
    fontSize: 18,
    fontFace: "Arial",
    color: colors.light,
    bold: true,
    align: "center",
    valign: "middle",
  });

  // Comparison points
  const comparisonPoints = [
    ["Teacher-centered", "Student-centered", "Balanced approach"],
    [
      "Memorization focus",
      "Understanding focus",
      "Comprehension with retention",
    ],
    ["Limited resources", "Digital tools", "Integrated resources"],
    ["One-size-fits-all", "Personalized paths", "Adaptable frameworks"],
  ];

  comparisonPoints.forEach((point, i) => {
    // Row background (alternating for readability)
    slide5.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 2.2 + i * 0.8,
      w: 9,
      h: 0.7,
      fill: { color: i % 2 === 0 ? colors.lightBg : colors.light },
    });

    // Column 1 - Traditional
    slide5.addText(point[0], {
      x: 0.7,
      y: 2.3 + i * 0.8,
      w: 2.6,
      h: 0.5,
      fontSize: 14,
      fontFace: "Arial",
      color: colors.dark,
      align: "left",
    });

    // Column 2 - Modern
    slide5.addText(point[1], {
      x: 3.7,
      y: 2.3 + i * 0.8,
      w: 2.6,
      h: 0.5,
      fontSize: 14,
      fontFace: "Arial",
      color: colors.dark,
      align: "left",
    });

    // Column 3 - Best Practice
    slide5.addText(point[2], {
      x: 6.7,
      y: 2.3 + i * 0.8,
      w: 2.6,
      h: 0.5,
      fontSize: 14,
      fontFace: "Arial",
      color: colors.dark,
      align: "left",
    });
  });

  // Key takeaway at the bottom
  slide5.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 5.5,
    w: 9,
    h: 1.5,
    fill: { color: colors.lightBg },
    line: { color: colors.primary, width: 1 },
  });

  slide5.addText("Key Takeaway", {
    x: 0.5,
    y: 5.6,
    w: 9,
    h: 0.4,
    fontSize: 16,
    fontFace: "Arial",
    color: colors.primary,
    bold: true,
    align: "center",
  });

  slide5.addText(
    "The most effective education approaches combine the structure of traditional methods with the flexibility and engagement of modern techniques, creating a balanced learning environment.",
    {
      x: 1,
      y: 6,
      w: 8,
      h: 0.9,
      fontSize: 14,
      fontFace: "Arial",
      color: colors.dark,
      align: "center",
    }
  );

  // ===== SLIDE 6: SUMMARY SLIDE =====
  const slide6 = pptx.addSlide();

  // Header
  slide6.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 1,
    fill: { color: colors.primary },
  });

  slide6.addText("Summary", {
    x: 0.5,
    y: 0.25,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: colors.light,
    bold: true,
  });

  // Content background
  slide6.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1,
    w: 10,
    h: 6.5,
    fill: { color: colors.light },
  });

  // Summary points
  const summaryPoints = [
    "Learning is a structured process with distinct stages",
    "Effective techniques combine traditional and modern approaches",
    "Understanding individual learning styles enhances outcomes",
    "Practice and application reinforce theoretical knowledge",
    "Feedback and reflection are essential for improvement",
  ];

  slide6.addText("Key Points to Remember", {
    x: 0.5,
    y: 1.3,
    w: 9,
    h: 0.5,
    fontSize: 18,
    fontFace: "Arial",
    color: colors.primary,
    bold: true,
  });

  summaryPoints.forEach((point, i) => {
    // Check mark icon
    slide6.addShape(pptx.ShapeType.rect, {
      x: 0.7,
      y: 2 + i * 0.7,
      w: 0.2,
      h: 0.2,
      fill: { color: colors.accent },
    });

    // Summary point text
    slide6.addText(point, {
      x: 1.2,
      y: 1.9 + i * 0.7,
      w: 8,
      h: 0.5,
      fontSize: 16,
      fontFace: "Arial",
      color: colors.dark,
    });
  });

  // Call to action at the bottom
  slide6.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 5.5,
    w: 9,
    h: 1.5,
    fill: { color: colors.primary },
  });

  slide6.addText("Next Steps", {
    x: 0.5,
    y: 5.6,
    w: 9,
    h: 0.5,
    fontSize: 18,
    fontFace: "Arial",
    color: colors.light,
    bold: true,
    align: "center",
  });

  slide6.addText(
    "Apply these principles in your own learning and teaching strategies. Focus on creating balanced, engaging, and effective educational experiences.",
    {
      x: 1,
      y: 6.1,
      w: 8,
      h: 0.8,
      fontSize: 16,
      fontFace: "Arial",
      color: colors.light,
      align: "center",
    }
  );

  // Save the presentation
  pptx
    .writeFile({ fileName: "Minimalist_Education_Template.pptx" })
    .then((fileName) => {
      console.log(`Created: ${fileName}`);
    });
};

// Run the template creation function
createMinimalistEducationTemplate();

export default createMinimalistEducationTemplate;
