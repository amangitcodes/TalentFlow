import React from 'react';

// Function to parse mentions and wrap with highlight <span>
function renderMentions(text, candidates) {
  const mentionRegex = /@(\w+)/g;
  const parts = [];
  let lastIndex = 0;

  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    const start = match.index;
    const end = mentionRegex.lastIndex;
    const mention = match[1];

    // Push text before mention
    if (start > lastIndex) {
      parts.push(text.substring(lastIndex, start));
    }

    // Find candidate matching mention (by name or email)
    const candidate = candidates.find(c => 
      c.name.toLowerCase().includes(mention.toLowerCase()) || 
      c.email.toLowerCase().includes(mention.toLowerCase())
    );

    if (candidate) {
      parts.push(
        <span key={start} style={{ color: '#007bff', fontWeight: 'bold' }}>
          @{mention}
        </span>
      );
    } else {
      parts.push(text.substring(start, end));
    }
    lastIndex = end;
  }
  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

function CandidateNotes({ notes, candidates }) {
  if (!notes || notes.length === 0) return <p>No notes available.</p>;

  return (
    <ul>
      {notes.map(note => (
        <li key={note.id} style={{ marginBottom: '10px' }}>
          {renderMentions(note.text, candidates)}
          <div style={{ fontSize: '0.8em', color: '#666' }}>
            - {note.author} at {new Date(note.date).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CandidateNotes;
