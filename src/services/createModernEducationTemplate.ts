import PptxGenJS from "pptxgenjs";

/**
 * Creates a modern education-themed presentation template
 * with various slide layouts for educational content
 */
export const createModernEducationTemplate = async () => {
  // Initialize presentation with modern fonts
  const pptx = new PptxGenJS();
  pptx.theme = { bodyFontFace: "Montserrat" };

  // Color palette for modern education theme
  const colors = {
    primary: "4361EE", // Blue
    secondary: "3A0CA3", // Deep purple
    accent1: "7209B7", // Purple
    accent2: "F72585", // Pink
    accent3: "4CC9F0", // Light blue
    dark: "2B2D42", // Dark blue-gray
    light: "FFFFFF", // White
    lightGray: "F8F9FA", // Light gray
  };

  // === SLIDE 1: TITLE SLIDE ===
  const slide1 = pptx.addSlide();

  // Background gradient - using compatible properties
  slide1.background = {
    color: colors.primary,
    // Use compatible properties instead of gradientType and gradientStops
  };

  // Left side decorative element
  slide1.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 3,
    h: 7.5,
    fill: { color: colors.accent1, transparency: 70 },
  });

  // Add a modern abstract shape
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 0.5,
    w: 2,
    h: 1.5,
    fill: { color: colors.accent2, transparency: 50 },
    line: { color: colors.light, width: 1, transparency: 50 },
    rectRadius: 10,
  });

  // Title
  slide1.addText("Modern Education", {
    x: 3.5,
    y: 2.2,
    w: 6,
    h: 1.2,
    fontSize: 44,
    fontFace: "Montserrat",
    color: colors.light,
    bold: true,
    align: "left",
  });

  // Subtitle
  slide1.addText("Interactive Learning Platform", {
    x: 3.5,
    y: 3.8,
    w: 6,
    h: 0.8,
    fontSize: 24,
    fontFace: "Montserrat",
    color: colors.light,
    align: "left",
  });

  // Author
  slide1.addText("Presented by: John Doe", {
    x: 3.5,
    y: 4.8,
    w: 6,
    h: 0.5,
    fontSize: 16,
    fontFace: "Montserrat",
    color: colors.light,
    italic: true,
    align: "left",
  });

  // === SLIDE 2: TABLE OF CONTENTS ===
  const slide2 = pptx.addSlide();

  // Add header bar
  slide2.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 1,
    fill: { color: colors.primary },
  });

  // Title in header
  slide2.addText("Course Overview", {
    x: 0.5,
    y: 0.2,
    w: 9,
    h: 0.7,
    fontSize: 28,
    fontFace: "Montserrat",
    color: colors.light,
    bold: true,
  });

  // Left sidebar
  slide2.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1,
    w: 2.5,
    h: 6.5,
    fill: { color: colors.lightGray },
  });

  // Content area
  slide2.addShape(pptx.ShapeType.rect, {
    x: 2.5,
    y: 1,
    w: 7.5,
    h: 6.5,
    fill: { color: colors.light },
  });

  // Navigation sidebar content
  const modules = [
    "Module 1: Introduction",
    "Module 2: Core Concepts",
    "Module 3: Applied Learning",
    "Module 4: Case Studies",
    "Module 5: Assessments",
  ];

  modules.forEach((module, i) => {
    slide2.addText(module, {
      x: 0.5,
      y: 1.5 + i * 0.8,
      w: 2,
      h: 0.6,
      fontSize: 14,
      fontFace: "Montserrat",
      color: colors.dark,
      bold: i === 0, // Bold the first one to show it's active
      fill: i === 0 ? { color: colors.accent3, transparency: 70 } : undefined,
    });
  });

  // Overview description
  slide2.addText(
    "In this course, you will learn the fundamentals of modern education techniques and how to apply them in various learning contexts. We focus on interactive methods, digital tools, and evidence-based approaches.",
    {
      x: 3,
      y: 1.5,
      w: 6.5,
      h: 1.2,
      fontSize: 16,
      fontFace: "Montserrat",
      color: colors.dark,
    }
  );

  // Key outcomes with icons
  const outcomes = [
    "Understand core learning theories",
    "Master digital education tools",
    "Design effective learning experiences",
    "Implement assessment strategies",
  ];

  outcomes.forEach((outcome, i) => {
    // Circle bullet point
    slide2.addShape(pptx.ShapeType.ellipse, {
      x: 3,
      y: 3 + i * 0.8,
      w: 0.15,
      h: 0.15,
      fill: { color: colors.accent1 },
    });

    // Outcome text
    slide2.addText(outcome, {
      x: 3.3,
      y: 2.9 + i * 0.8,
      w: 6.2,
      h: 0.6,
      fontSize: 16,
      fontFace: "Montserrat",
      color: colors.dark,
    });
  });

  // === SLIDE 3: CONCEPT SLIDE ===
  const slide3 = pptx.addSlide();

  // Add header bar
  slide3.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 1,
    fill: { color: colors.primary },
  });

  // Title in header
  slide3.addText("Key Educational Concepts", {
    x: 0.5,
    y: 0.2,
    w: 9,
    h: 0.7,
    fontSize: 28,
    fontFace: "Montserrat",
    color: colors.light,
    bold: true,
  });

  // Background for clean look
  slide3.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1,
    w: 10,
    h: 6.5,
    fill: { color: colors.light },
  });

  // Concept cards in a 2x2 grid
  const concepts = [
    {
      title: "Active Learning",
      description:
        "Instructional approach that engages students in the learning process through activities and reflection.",
    },
    {
      title: "Flipped Classroom",
      description:
        "Instructional strategy where students learn content at home and practice during class time.",
    },
    {
      title: "Project-Based Learning",
      description:
        "Teaching method where students gain knowledge by investigating and responding to challenges.",
    },
    {
      title: "Formative Assessment",
      description:
        "Ongoing process of monitoring student learning to provide continuous feedback.",
    },
  ];

  const cardPositions = [
    { x: 0.5, y: 1.5 },
    { x: 5.25, y: 1.5 },
    { x: 0.5, y: 4.2 },
    { x: 5.25, y: 4.2 },
  ];

  concepts.forEach((concept, i) => {
    // Card background with subtle shadow
    slide3.addShape(pptx.ShapeType.roundRect, {
      x: cardPositions[i].x,
      y: cardPositions[i].y,
      w: 4.25,
      h: 2.3,
      fill: { color: colors.lightGray },
      line: { color: colors.primary, width: 1 },
      shadow: {
        type: "outer",
        blur: 3,
        offset: 2,
        angle: 45,
        color: "808080",
        opacity: 0.3,
      },
      rectRadius: 8,
    });

    // Colored accent bar
    slide3.addShape(pptx.ShapeType.rect, {
      x: cardPositions[i].x,
      y: cardPositions[i].y,
      w: 4.25,
      h: 0.1,
      fill: { color: i % 2 === 0 ? colors.accent1 : colors.accent2 },
    });

    // Concept title
    slide3.addText(concept.title, {
      x: cardPositions[i].x,
      y: cardPositions[i].y + 0.3,
      w: 4.25,
      h: 0.4,
      fontSize: 18,
      fontFace: "Montserrat",
      color: colors.dark,
      bold: true,
      align: "center",
    });

    // Concept description
    slide3.addText(concept.description, {
      x: cardPositions[i].x + 0.5,
      y: cardPositions[i].y + 0.9,
      w: 3.25,
      h: 1.2,
      fontSize: 14,
      fontFace: "Montserrat",
      color: colors.dark,
      align: "left",
    });
  });

  // === SLIDE 4: COMPARISON SLIDE ===
  const slide4 = pptx.addSlide();

  // Add header bar
  slide4.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 1,
    fill: { color: colors.primary },
  });

  // Title in header
  slide4.addText("Traditional vs. Modern Education", {
    x: 0.5,
    y: 0.2,
    w: 9,
    h: 0.7,
    fontSize: 28,
    fontFace: "Montserrat",
    color: colors.light,
    bold: true,
  });

  // Background for clean look
  slide4.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1,
    w: 10,
    h: 6.5,
    fill: { color: colors.light },
  });

  // Left column - Traditional
  slide4.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.5,
    w: 4.25,
    h: 5.3,
    fill: { color: colors.lightGray },
    line: { color: colors.dark, width: 1 },
    rectRadius: 8,
  });

  // Right column - Modern
  slide4.addShape(pptx.ShapeType.roundRect, {
    x: 5.25,
    y: 1.5,
    w: 4.25,
    h: 5.3,
    fill: { color: colors.lightGray },
    line: { color: colors.primary, width: 1 },
    rectRadius: 8,
  });

  // Column headers
  slide4.addText("Traditional Education", {
    x: 0.5,
    y: 1.7,
    w: 4.25,
    h: 0.5,
    fontSize: 18,
    fontFace: "Montserrat",
    color: colors.dark,
    bold: true,
    align: "center",
  });

  slide4.addText("Modern Education", {
    x: 5.25,
    y: 1.7,
    w: 4.25,
    h: 0.5,
    fontSize: 18,
    fontFace: "Montserrat",
    color: colors.primary,
    bold: true,
    align: "center",
  });

  // Comparison points
  const comparisonPoints = [
    ["Teacher-centered", "Student-centered"],
    ["Passive learning", "Active learning"],
    ["Standardized curriculum", "Personalized learning paths"],
    ["Limited technology use", "Technology integration"],
    ["Focus on memorization", "Focus on critical thinking"],
    ["Scheduled class times", "Flexible learning options"],
  ];

  comparisonPoints.forEach((point, i) => {
    // Traditional point
    slide4.addText(`• ${point[0]}`, {
      x: 0.7,
      y: 2.4 + i * 0.6,
      w: 3.85,
      h: 0.5,
      fontSize: 16,
      fontFace: "Montserrat",
      color: colors.dark,
      align: "left",
    });

    // Modern point
    slide4.addText(`• ${point[1]}`, {
      x: 5.45,
      y: 2.4 + i * 0.6,
      w: 3.85,
      h: 0.5,
      fontSize: 16,
      fontFace: "Montserrat",
      color: colors.primary,
      align: "left",
    });
  });

  // === SLIDE 5: PROCESS FLOW ===
  const slide5 = pptx.addSlide();

  // Add header bar
  slide5.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 1,
    fill: { color: colors.primary },
  });

  // Title in header
  slide5.addText("Learning Process Flow", {
    x: 0.5,
    y: 0.2,
    w: 9,
    h: 0.7,
    fontSize: 28,
    fontFace: "Montserrat",
    color: colors.light,
    bold: true,
  });

  // Background for clean look
  slide5.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1,
    w: 10,
    h: 6.5,
    fill: { color: colors.light },
  });

  // Process steps
  const steps = [
    {
      title: "Explore",
      description:
        "Discover new concepts and ideas through guided exploration.",
    },
    {
      title: "Understand",
      description:
        "Develop comprehension of key principles through explanation and examples.",
    },
    {
      title: "Practice",
      description: "Apply concepts through hands-on activities and exercises.",
    },
    {
      title: "Reflect",
      description:
        "Consider what was learned and how it connects to prior knowledge.",
    },
    {
      title: "Apply",
      description: "Use new knowledge in real-world contexts and situations.",
    },
  ];

  // Create flow line
  slide5.addShape(pptx.ShapeType.line, {
    x: 1,
    y: 3.8,
    w: 8,
    h: 0,
    line: { color: colors.accent3, width: 3, dashType: "dash" },
  });

  steps.forEach((step, i) => {
    const xPos = 1.5 + i * 1.75;

    // Circle node
    slide5.addShape(pptx.ShapeType.ellipse, {
      x: xPos,
      y: 3.6,
      w: 0.4,
      h: 0.4,
      fill: { color: colors.accent1 },
    });

    // Number in circle
    slide5.addText(`${i + 1}`, {
      x: xPos,
      y: 3.6,
      w: 0.4,
      h: 0.4,
      fontSize: 16,
      fontFace: "Montserrat",
      color: colors.light,
      bold: true,
      align: "center",
      valign: "middle",
    });

    // Step title above
    slide5.addText(step.title, {
      x: xPos - 0.5,
      y: 2.3,
      w: 1.4,
      h: 0.6,
      fontSize: 18,
      fontFace: "Montserrat",
      color: colors.primary,
      bold: true,
      align: "center",
    });

    // Step description below
    slide5.addText(step.description, {
      x: xPos - 0.6,
      y: 4.2,
      w: 1.6,
      h: 1.5,
      fontSize: 14,
      fontFace: "Montserrat",
      color: colors.dark,
      align: "center",
    });
  });

  // === SLIDE 6: INFOGRAPHIC SLIDE ===
  const slide6 = pptx.addSlide();

  // Add header bar
  slide6.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 1,
    fill: { color: colors.primary },
  });

  // Title in header
  slide6.addText("Educational Technology Adoption", {
    x: 0.5,
    y: 0.2,
    w: 9,
    h: 0.7,
    fontSize: 28,
    fontFace: "Montserrat",
    color: colors.light,
    bold: true,
  });

  // Background for clean look
  slide6.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 1,
    w: 10,
    h: 6.5,
    fill: { color: colors.light },
  });

  // Central infographic
  slide6.addShape(pptx.ShapeType.ellipse, {
    x: 4,
    y: 2.6,
    w: 2,
    h: 2,
    fill: { color: colors.accent1 },
  });

  slide6.addText("EdTech", {
    x: 4,
    y: 2.6,
    w: 2,
    h: 2,
    fontSize: 18,
    fontFace: "Montserrat",
    color: colors.light,
    bold: true,
    align: "center",
    valign: "middle",
  });

  // Radiating categories
  const categories = [
    { title: "Mobile Learning", x: 2, y: 1.9, color: colors.accent2 },
    { title: "Virtual Reality", x: 1.5, y: 3.8, color: colors.primary },
    { title: "Online Courses", x: 3, y: 5, color: colors.accent3 },
    { title: "AI Tutoring", x: 6, y: 5, color: colors.secondary },
    { title: "Learning Analytics", x: 7.5, y: 3.8, color: colors.accent2 },
    { title: "Gamification", x: 7, y: 1.9, color: colors.primary },
  ];

  categories.forEach((category) => {
    // Connection line
    slide6.addShape(pptx.ShapeType.line, {
      x: 5,
      y: 3.6,
      w: category.x - 5,
      h: category.y - 3.6,
      line: { color: category.color, width: 2 },
      flipH: category.x < 5,
    });

    // Category circle
    slide6.addShape(pptx.ShapeType.ellipse, {
      x: category.x - 0.5,
      y: category.y - 0.5,
      w: 1,
      h: 1,
      fill: { color: category.color, transparency: 20 },
      line: { color: category.color, width: 2 },
    });

    // Category name
    slide6.addText(category.title, {
      x: category.x - 0.7,
      y: category.y - 0.5,
      w: 1.4,
      h: 1,
      fontSize: 14,
      fontFace: "Montserrat",
      color: colors.dark,
      bold: true,
      align: "center",
      valign: "middle",
    });
  });

  // Save the presentation
  pptx
    .writeFile({ fileName: "Modern_Education_Template.pptx" })
    .then((fileName) => {
      console.log(`Created: ${fileName}`);
    });
};

// Run the template creation function
createModernEducationTemplate();

export default createModernEducationTemplate;
