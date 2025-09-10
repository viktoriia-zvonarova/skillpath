# SkillPath Usage Guide

## Quick Start

1. **Open Template**: Open `index.html` in your browser
2. **Load Sample**: Click "Load Sample Data" button to see a complete DevOps example
3. **Customize**: Modify content using the form controls at the top
4. **Toggle Sections**: Use checkboxes to show/hide sections as needed
5. **Export**: Click "Export to PDF" when finished

## Form Controls Overview

### Basic Information
| Field | Description | Example |
|-------|-------------|---------|
| Plan Title | Main heading | "Frontend Developer Roadmap" |
| Subtitle | Career transition description | "Junior → Senior Frontend Developer" |
| Duration | Total months | 6 |
| Hours per Week | Time commitment | "8-10" |

### Learning Timeline

Each phase includes:
- **Time**: When it occurs ("M 1-2", "Week 1-4")
- **Title**: Phase name ("Foundation", "Advanced")
- **Description**: Bullet-pointed activities

**Best Practices:**
- Use 3-5 phases for optimal readability
- Include specific, measurable activities
- Write in imperative mood ("Complete X", "Build Y")

### Core Technologies

Each skill includes:
- **Name**: Technology/framework name
- **Description**: Brief explanation of use/benefits

**Tips:**
- Limit to 2-5 skills to maintain focus
- Order by importance or learning sequence
- Include both technical and methodological skills

## Customization Examples

### Career Transition Plans

**Software Engineer → DevOps**
```
Skills: Docker, Kubernetes, AWS, Terraform
Duration: 8 months, 6-8 hours/week
Phases: Containerization → Orchestration → Cloud → IaC
```

**Designer → Frontend Developer**
```
Skills: HTML/CSS, JavaScript, React, Git
Duration: 6 months, 10-12 hours/week
Phases: Web Fundamentals → JavaScript → Framework → Projects
```

**Analyst → Data Scientist**
```
Skills: Python, Statistics, ML, SQL, Visualization
Duration: 12 months, 8-10 hours/week
Phases: Programming → Statistics → ML → Projects → Specialization
```

### Skill Development Plans

**React Developer Learning Next.js**
```
Skills: Next.js, SSR, API Routes
Duration: 3 months, 5-6 hours/week
Phases: Setup → Features → Optimization
```

**Backend Engineer Adding Frontend**
```
Skills: React, TypeScript, CSS
Duration: 4 months, 6-8 hours/week
Phases: Fundamentals → Components → State → Styling
```

## PDF Export Tips

### For Best Results:
- Ensure all content fits well on screen first
- Use concise descriptions to avoid text overflow
- Test export before finalizing content
- Check that charts render properly

### Troubleshooting:
- **Blank PDF**: Check browser console for errors
- **Cut-off Content**: Reduce description lengths
- **No Chart**: Verify Chart.js loaded correctly
- **Poor Quality**: Increase browser zoom before export

## Content Guidelines

### Timeline Descriptions
✅ **Good Examples:**
- "Complete React fundamentals course and build 3 practice projects"
- "Deploy containerized applications using Docker and Docker Compose"
- "Implement CI/CD pipeline with automated testing and deployment"

❌ **Avoid:**
- Vague goals: "Learn React"
- No measurable outcomes: "Understand Docker"
- Too complex: Multiple long paragraphs

### Skill Descriptions
✅ **Good Examples:**
- "Container orchestration platform for managing microservices"
- "Infrastructure as Code tool for AWS resource provisioning"
- "JavaScript library for building interactive user interfaces"

❌ **Avoid:**
- Too technical: Full API documentation
- Too simple: Single words
- Marketing speak: "Revolutionary game-changing technology"

### Professional Language
- Use active voice: "Build applications" not "Applications will be built"
- Be specific: "3 projects" not "several projects"
- Include outcomes: "Deploy to production" not just "Learn deployment"

## Advanced Customization

### Modifying Styles
Edit `assets/css/styles.css` for:
- Brand colors (change `#4299e1` values)
- Typography (modify font-family)
- Layout spacing (adjust padding/margin)

### Adding Fields
To add new form fields:
1. Add HTML input in form-controls section
2. Add corresponding display element
3. Update `updateContent()` function in app.js

### Custom Templates
Create variations by:
- Modifying default phase names/descriptions
- Changing metric labels
- Adjusting skill limits
- Adding new sections

## Browser Compatibility

### Fully Supported:
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Limited Support:
- Internet Explorer (PDF export may fail)
- Older mobile browsers

### Requirements:
- JavaScript enabled
- Modern CSS support (Grid, Flexbox)
- Canvas API for charts