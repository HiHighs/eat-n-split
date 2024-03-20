import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className='button' onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleToggleAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends([...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectFriend(friend) {
    // When already selected set selectedFriend to null
    setSelectedFriend((cur) => (cur === friend ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend === selectedFriend
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleToggleAddFriend}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill} />
      )}
    </div>
  );
}

function FriendList({ friends, selectedFriend, onSelectFriend }) {
  return (
    <ul>
      {friends.map((f) => (
        <Friend
          friend={f}
          key={f.id}
          selectedFriend={selectedFriend}
          onSelectFriend={onSelectFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelectFriend }) {
  const isSelected = friend === selectedFriend;

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} €{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you €{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e) {
    e.preventDefault();

    // Do nothing if input empty
    if (!name || !image) return;

    // Add new friend
    const id = crypto.randomUUID();
    onAddFriend({
      id: id,
      name: name,
      image: `${image}?=${id}`,
      balance: 0,
    });

    // Reset input
    setName('');
    setImage('https://i.pravatar.cc/48');
  }

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label htmlFor='name'>👪 Friend name</label>
      <input
        id='name'
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor='image'>📷 Image Url</label>
      <input
        id='image'
        type='text'
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [yours, setYours] = useState('');
  const friends = bill ? bill - yours : '';
  const [paying, setPaying] = useState('you');

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !yours) return;

    onSplitBill(paying === 'you' ? friends : -yours);
  }

  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>

      <label htmlFor='bill'>💰 Bill value</label>
      <input
        id='bill'
        type='text'
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label htmlFor='yours'>🙋 Your expense</label>
      <input
        id='yours'
        type='text'
        value={yours}
        onChange={(e) =>
          setYours(
            Number(e.target.value) > bill ? yours : Number(e.target.value)
          )
        }
      />

      <label htmlFor='friends'>👪 {friend.name}'s expense</label>
      <input id='friends' type='text' value={friends} disabled />

      <label htmlFor='paying'>💶 Who is paying the bill?</label>
      <select
        id='paying'
        value={paying}
        onChange={(e) => setPaying(e.target.value)}
      >
        <option value='you'>You</option>
        <option value='friend'>{friend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
